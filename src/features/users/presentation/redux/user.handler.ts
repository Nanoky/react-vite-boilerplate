
// Register handlers

import type { Handler } from "@/shared/core/handler";
import { type ActionHandler } from "@/shared/redux/actions-handler";
import { fetchUser, type FetchUserPayload } from "./user.action";
import { FETCH_USER_CACHE_DURATION_MS } from "./user.cache";
import { userActions } from "./user.slice";
import { GetUser } from "../../application/get-user.usecase";
import { container } from "@/di/container";
import { UsersModule } from "../../users.module";
import { buildKey } from "@/shared/utils/build-key.utils";

export class UsersActionsHandler implements Handler {
    private _type: string;
    private _handler: ActionHandler;
    constructor(
        handler: ActionHandler,
    ) {
        this._handler = handler;
        this._type = fetchUser.type;
        this._handler.register(this._type, fetchUser);
    }

    private handleFetch() {
        this._handler.on<FetchUserPayload>(this._type, async (payload, api) => {
            if (!payload) {
                return;
            }

            const key = buildKey(this._type, payload.id);

            try {
                if (this._handler.stillCached(key, api)) {
                    this._handler.succeed(key, api);
                    return;
                }
                this._handler.startLoading(key, api);

                const usecase = container.resolve<GetUser>(UsersModule.tokens!.GetUser) as GetUser;
                const res = await usecase.execute(payload.id);

                api.dispatch(userActions.storeUser(res));

                this._handler.succeed(key, api, FETCH_USER_CACHE_DURATION_MS);
            } catch (error) {
                this._handler.fail(key, api, error);
            }
        });
    }
    handle(): void {
        this.handleFetch();
    }
}