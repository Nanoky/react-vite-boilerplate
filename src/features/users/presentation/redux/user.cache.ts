
import { registerCache } from "../../../../shared/redux/cache-registry";
import { breakKey } from "../../../../shared/utils/build-key.utils";
import { userActions } from "./user.slice";

export const FETCH_USER_CACHE_DURATION_MS = 30000;

registerCache(
    key => key.startsWith('users:'),
    (key, store) => {
        const id = breakKey(key).params;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (store as any).dispatch(userActions.removeUser({ id: id as string }));
    },
    FETCH_USER_CACHE_DURATION_MS
);