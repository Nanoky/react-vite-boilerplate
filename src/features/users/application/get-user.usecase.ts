import type { User } from "../domain/user";
import type { UserRepository } from "../domain/user.repository";

export class GetUser {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(id: string): Promise<User> {
        return await this.userRepository.getUser(id);
    }
}
