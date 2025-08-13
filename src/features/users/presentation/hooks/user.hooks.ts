
import { buildKey } from "@/shared/utils/build-key.utils";
import { useAppDispatch, useAppSelector, type RootState } from "@/store";
import { fetchUser } from "../redux/user.action";
import { useActionStatus } from "@/shared/hooks/use-action-status.hook";


export function useUser() {
    const dispatch = useAppDispatch();
    const users = useAppSelector((state: RootState) => state.user.entities);
    const lastFetchedId = useAppSelector((state: RootState) => state.user.lastUpdatedId);
    const fetchStatus = useActionStatus(buildKey(fetchUser.type, lastFetchedId));

    function fetch(id: string) {
        dispatch(fetchUser({
            id
        }));
    }

    return {
        user: lastFetchedId ? users[lastFetchedId] : null,
        loading: fetchStatus.isLoading,
        fetch,
    };
}