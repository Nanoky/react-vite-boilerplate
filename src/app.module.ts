
import { UsersModule } from "./features/users/users.module";
import type { Module } from "./shared/core/module";
import { SharedModule } from "./shared/shared.module";



export const AppModule: Module = {
    register: () => {
        if (SharedModule.register) SharedModule.register();
        if (UsersModule.register) UsersModule.register();
    },
    initialize: () => {
        if (SharedModule.initialize) SharedModule.initialize();
        if (UsersModule.initialize) UsersModule.initialize();
    }
};