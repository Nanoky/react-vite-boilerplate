
import { buildKey } from "../../../../shared/utils/build-key.utils";
import { useAppDispatch, useAppSelector, type RootState } from "../../../../store";
import { fetchUser } from "../redux/user.action";


export function useUser() {
    const dispatch = useAppDispatch();
    const users = useAppSelector((state: RootState) => state.user.entities);
    const lastFetchedId = useAppSelector((state: RootState) => state.user.lastUpdatedId);
    const loading = useAppSelector((state) => state.status[buildKey('users', lastFetchedId)]?.status ?? 'idle') === 'loading';

    function fetch(id: string) {
        dispatch(fetchUser({
            id
        }));
    }

    return {
        user: lastFetchedId ? users[lastFetchedId] : null,
        loading,
        fetch,
    };
}