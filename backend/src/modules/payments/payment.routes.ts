import { Router, type Request, type Response } from "express";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authenticate } from "../../shared/middleware/authenticate";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { db } from "../../shared/db/index";
import { orders, payments } from "../../shared/schema/index";
import { getPaymentGateway } from "./payment.gateway";

const router: Router = Router();
const createSchema = z.object({ orderId: z.string().uuid(), method: z.enum(["upi", "credit_card", "debit_card", "net_banking", "wallet"]) });
const verifySchema = z.object({ orderId: z.string().uuid(), razorpayOrderId: z.string().min(1), razorpayPaymentId: z.string().min(1), razorpaySignature: z.string().min(1) });

type RawBodyRequest = Request & { rawBody?: Buffer };
type RazorpayEntity = { id?: string; order_id?: string; amount?: number; error_description?: string; error_reason?: string };
type RazorpayWebhookBody = { event?: string; payload?: { payment?: { entity?: RazorpayEntity }; refund?: { entity?: RazorpayEntity } } };

function getWebhookEntity(body: RazorpayWebhookBody): RazorpayEntity | undefined {
  return body.payload?.payment?.entity ?? body.payload?.refund?.entity;
}

async function findPayment(entity: RazorpayEntity) {
  if (entity.id) {
    const [byPaymentId] = await db.select().from(payments).where(eq(payments.gatewayPaymentId, entity.id)).limit(1);
    if (byPaymentId) return byPaymentId;
  }
  if (entity.order_id) {
    const [byOrderId] = await db.select().from(payments).where(eq(payments.gatewayOrderId, entity.order_id)).limit(1);
    if (byOrderId) return byOrderId;
  }
  return undefined;
}

router.post("/create", authenticate, asyncHandler(async (req: Request, res: Response) => {
  const input = createSchema.parse(req.body);
  const [order] = await db.select().from(orders).where(and(eq(orders.id, input.orderId), eq(orders.userId, req.user!.sub))).limit(1);
  if (!order) { sendSuccess(res, null, "Order not found", 404); return; }
  if (order.paymentStatus === "completed") { sendSuccess(res, null, "Order is already paid", 409); return; }

  const gateway = getPaymentGateway();
  const session = await gateway.createPayment({ orderId: order.id, amount: Number(order.grandTotal), currency: "INR", method: input.method });
  const [payment] = await db.insert(payments).values({ orderId: order.id, gateway: "razorpay", gatewayOrderId: session.gatewayOrderId, status: "created", amount: order.grandTotal, currency: "INR" }).returning();
  sendSuccess(res, { paymentId: payment!.id, ...session }, "Payment session created", 201);
}));

router.post("/verify", authenticate, asyncHandler(async (req: Request, res: Response) => {
  const input = verifySchema.parse(req.body);
  const [order] = await db.select().from(orders).where(and(eq(orders.id, input.orderId), eq(orders.userId, req.user!.sub))).limit(1);
  if (!order) { sendSuccess(res, null, "Order not found", 404); return; }
  const gateway = getPaymentGateway();
  const verifier = gateway as typeof gateway & { verifyCheckoutSignature?: (orderId: string, paymentId: string, signature: string) => boolean };
  if (!verifier.verifyCheckoutSignature?.(input.razorpayOrderId, input.razorpayPaymentId, input.razorpaySignature)) {
    sendSuccess(res, null, "Invalid payment signature", 400); return;
  }
  const [payment] = await db.update(payments).set({ gatewayPaymentId: input.razorpayPaymentId, status: "completed", updatedAt: new Date() }).where(and(eq(payments.orderId, order.id), eq(payments.gatewayOrderId, input.razorpayOrderId))).returning();
  if (!payment) { sendSuccess(res, null, "Payment record not found", 404); return; }
  await db.update(orders).set({ paymentStatus: "completed", updatedAt: new Date() }).where(eq(orders.id, order.id));
  sendSuccess(res, { paymentId: payment.id, orderId: order.id }, "Payment verified");
}));

router.post("/webhook", asyncHandler(async (req: RawBodyRequest, res: Response) => {
  const signature = req.header("x-razorpay-signature");
  const rawBody = req.rawBody;
  if (!signature || !rawBody || !getPaymentGateway().verifyWebhook(signature, rawBody.toString("utf8"))) {
    sendSuccess(res, null, "Invalid webhook signature", 401); return;
  }

  const body = req.body as RazorpayWebhookBody;
  const entity = getWebhookEntity(body);
  const payment = entity ? await findPayment(entity) : undefined;
  if (!entity || !payment) {
    sendSuccess(res, { processed: false }, "Webhook received");
    return;
  }

  if (entity.amount !== undefined && body.event?.startsWith("payment.") && Math.abs(Number(payment.amount) - entity.amount / 100) > 0.01) {
    sendSuccess(res, null, "Payment amount mismatch", 400); return;
  }

  const event = body.event;
  if (event === "payment.captured" || event === "payment.authorized") {
    if (payment.status !== "completed") {
      await db.update(payments).set({ gatewayPaymentId: entity.id ?? payment.gatewayPaymentId, status: "completed", updatedAt: new Date() }).where(eq(payments.id, payment.id));
      await db.update(orders).set({ paymentStatus: "completed", updatedAt: new Date() }).where(eq(orders.id, payment.orderId));
    }
  } else if (event === "payment.failed") {
    if (payment.status !== "completed" && payment.status !== "refunded") {
      await db.update(payments).set({ gatewayPaymentId: entity.id ?? payment.gatewayPaymentId, status: "failed", failureReason: entity.error_description ?? entity.error_reason ?? "Payment failed", updatedAt: new Date() }).where(eq(payments.id, payment.id));
      await db.update(orders).set({ paymentStatus: "failed", updatedAt: new Date() }).where(eq(orders.id, payment.orderId));
    }
  } else if (event === "refund.processed") {
    if (payment.status !== "refunded") {
      await db.update(payments).set({ status: "refunded", updatedAt: new Date() }).where(eq(payments.id, payment.id));
      await db.update(orders).set({ paymentStatus: "refunded", updatedAt: new Date() }).where(eq(orders.id, payment.orderId));
    }
  }

  sendSuccess(res, { processed: true, paymentId: payment.id, event }, "Webhook processed");
}));

export default router;
