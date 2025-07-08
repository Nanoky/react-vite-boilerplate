
// Register handlers

import { TOKENS } from "../../../../di/tokens";
import { handleAsync } from "../../../../shared/redux/actions-handler";
import { buildKey } from "../../../../shared/utils/build-key.utils";
import { fetchUser } from "./user.action";
import { FETCH_USER_CACHE_DURATION_MS } from "./user.cache";
import { userActions } from "./user.slice";

handleAsync({
    key: 'users',
    cacheDurationMs: FETCH_USER_CACHE_DURATION_MS,
    keyFormat: (key, action) => buildKey(key, (action as ReturnType<typeof fetchUser>).payload.id),
    useCaseToken: TOKENS.GetUser,
    successAction: userActions.storeUser as unknown as (data: unknown) => ReturnType<typeof userActions.storeUser>,
    handler: (useCase, action) => useCase.execute((action as ReturnType<typeof fetchUser>).payload.id),
})({ actionCreator: fetchUser as unknown as (args?: unknown) => ReturnType<typeof fetchUser> });