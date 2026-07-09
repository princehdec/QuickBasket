import { type NewUser, type User } from "../../shared/schema/index.js";
export declare class AuthRepository {
    findByPhone(phone: string): Promise<User | undefined>;
    findById(id: string): Promise<User | undefined>;
    create(data: NewUser): Promise<User>;
}
//# sourceMappingURL=auth.repository.d.ts.map