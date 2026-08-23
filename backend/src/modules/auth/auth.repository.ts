import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "../../shared/db/index";
import {
  otpChallenges,
  users,
  type NewUser,
  type User,
  type OtpChallenge,
} from "../../shared/schema/index";

export class AuthRepository {
  async findByPhone(phone: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);
    return result[0];
  }

  async findById(id: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async create(data: NewUser): Promise<User> {
    const result = await db.insert(users).values(data).returning();
    return result[0]!;
  }

  async updateProfile(id: string, data: Pick<NewUser, "fullName" | "email">): Promise<User> {
    const result = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0]!;
  }

  async createOtpChallenge(data: {
    phone: string;
    codeHash: string;
    expiresAt: Date;
    maxAttempts: number;
  }): Promise<OtpChallenge> {
    const result = await db.insert(otpChallenges).values(data).returning();
    return result[0]!;
  }

  async findActiveOtpChallenge(phone: string, challengeId?: string): Promise<OtpChallenge | undefined> {
    const conditions = [
      eq(otpChallenges.phone, phone),
      isNull(otpChallenges.consumedAt),
      eq(otpChallenges.isBlocked, false),
      gt(otpChallenges.expiresAt, new Date()),
    ];

    if (challengeId) {
      conditions.push(eq(otpChallenges.id, challengeId));
    }

    const result = await db
      .select()
      .from(otpChallenges)
      .where(and(...conditions))
      .orderBy(otpChallenges.createdAt)
      .limit(1);
    return result[0];
  }

  async incrementOtpAttempt(id: string, block: boolean): Promise<void> {
    await db
      .update(otpChallenges)
      .set({
        attempts: block ? 5 : 1,
        isBlocked: block,
      })
      .where(eq(otpChallenges.id, id));
  }

  async consumeOtpChallenge(id: string): Promise<void> {
    await db
      .update(otpChallenges)
      .set({ consumedAt: new Date() })
      .where(eq(otpChallenges.id, id));
  }
}
