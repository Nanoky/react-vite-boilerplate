
import { container } from "@/di/container";
import { GetUser } from "./application/get-user.usecase";
import { FakeUserRepository } from "./infrastructure/fake-user.repository";
import type { Module } from "@/shared/core/module";
import { UsersActionsHandler } from "./presentation/redux/user.handler";
import { SharedModule } from "@/shared/shared.module";


const TOKENS = {
    UserRepository: Symbol('UserRepository'),
    GetUser: Symbol('GetUser'),
    Handler: Symbol('Handler')
};

export const UsersModule: Module = {
    tokens: TOKENS,
    register: () => {
        container.register(TOKENS.UserRepository, () => new FakeUserRepository());
        container.register(TOKENS.GetUser, () => new GetUser(container.resolve(TOKENS.UserRepository)));
        container.register(TOKENS.Handler, () => new UsersActionsHandler(container.resolve(SharedModule.tokens!.ActionHandler)));
    },
    initialize: () => {
        (container.resolve(TOKENS.Handler) as UsersActionsHandler).handle();
    }
}