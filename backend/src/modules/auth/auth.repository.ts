import { db } from "../../shared/db/index";
import { users, type NewUser, type User } from "../../shared/schema/index";
import { eq } from "drizzle-orm";

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
    const result = await db
      .insert(users)
      .values(data)
      .returning();
    return result[0]!;
  }
}
