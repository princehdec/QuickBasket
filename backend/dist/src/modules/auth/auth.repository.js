import { db } from "../../shared/db/index.js";
import { users } from "../../shared/schema/index.js";
import { eq } from "drizzle-orm";
export class AuthRepository {
    async findByPhone(phone) {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.phone, phone))
            .limit(1);
        return result[0];
    }
    async findById(id) {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);
        return result[0];
    }
    async create(data) {
        const result = await db
            .insert(users)
            .values(data)
            .returning();
        return result[0];
    }
}
//# sourceMappingURL=auth.repository.js.map