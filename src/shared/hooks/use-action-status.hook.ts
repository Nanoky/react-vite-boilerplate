import { useAppSelector } from "@/store";



export function useActionStatus(actionType: string) {
    const isLoading = useAppSelector((state) => state.status[actionType]?.status === 'loading');
    const isError = useAppSelector((state) => state.status[actionType]?.status === 'error');
    const isSuccess = useAppSelector((state) => state.status[actionType]?.status === 'success');
    return {
        isLoading,
        isError,
        isSuccess
    }
}