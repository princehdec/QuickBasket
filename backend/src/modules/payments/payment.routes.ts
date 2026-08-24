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

router.post("/create", authenticate, asyncHandler(async (req: Request, res: Response) => {
  const input = createSchema.parse(req.body);
  const [order] = await db.select().from(orders).where(and(eq(orders.id, input.orderId), eq(orders.userId, req.user!.sub))).limit(1);
  if (!order) { res.status(404); sendSuccess(res, null, "Order not found"); return; }
  if (order.paymentStatus === "completed") { res.status(409); sendSuccess(res, null, "Order is already paid"); return; }

  const gateway = getPaymentGateway();
  const session = await gateway.createPayment({ orderId: order.id, amount: Number(order.grandTotal), currency: "INR", method: input.method });
  const [payment] = await db.insert(payments).values({ orderId: order.id, gateway: "razorpay", gatewayOrderId: session.gatewayOrderId, status: "created", amount: order.grandTotal, currency: "INR" }).returning();
  sendSuccess(res, { paymentId: payment!.id, ...session }, "Payment session created", 201);
}));

router.post("/verify", authenticate, asyncHandler(async (req: Request, res: Response) => {
  const input = verifySchema.parse(req.body);
  const [order] = await db.select().from(orders).where(and(eq(orders.id, input.orderId), eq(orders.userId, req.user!.sub))).limit(1);
  if (!order) { res.status(404); sendSuccess(res, null, "Order not found"); return; }
  const gateway = getPaymentGateway();
  const verifier = gateway as typeof gateway & { verifyCheckoutSignature?: (orderId: string, paymentId: string, signature: string) => boolean };
  if (!verifier.verifyCheckoutSignature?.(input.razorpayOrderId, input.razorpayPaymentId, input.razorpaySignature)) {
    res.status(400); sendSuccess(res, null, "Invalid payment signature"); return;
  }
  const [payment] = await db.update(payments).set({ gatewayPaymentId: input.razorpayPaymentId, status: "completed", updatedAt: new Date() }).where(and(eq(payments.orderId, order.id), eq(payments.gatewayOrderId, input.razorpayOrderId))).returning();
  if (!payment) { res.status(404); sendSuccess(res, null, "Payment record not found"); return; }
  await db.update(orders).set({ paymentStatus: "completed", updatedAt: new Date() }).where(eq(orders.id, order.id));
  sendSuccess(res, { paymentId: payment.id, orderId: order.id }, "Payment verified");
}));

export default router;
