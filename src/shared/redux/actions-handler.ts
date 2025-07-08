import { container } from "../../di/container";
import type { AppDispatch, RootState } from "../../store";
import { listenerMiddleware } from "../../store/listener";
import type { Executable } from "../core/executable";
import { type OperationMeta, setStatus } from "./status-manager.slice";

const shouldRefetch = (meta: OperationMeta | undefined): boolean => {
    if (!meta?.cacheUntil) return true;
    return Date.now() > meta.cacheUntil;
};

type TypeAction = Parameters<AppDispatch>[0];
export const handleAsync =
    <ActionPending, ActionSuccess extends TypeAction, ActionFailure extends TypeAction, UseCase extends Executable<unknown, unknown>>(params: {
        key: string,
        cacheDurationMs?: number,
        keyFormat?: (key: string, args?: unknown) => string,
        useCaseToken: symbol,
        successAction: (data: unknown) => ActionSuccess,
        failureAction?: (error: unknown) => ActionFailure,
        handler: (useCase: UseCase, action: unknown) => Promise<unknown>
    }) =>
        ({
            actionCreator,
        }: {
            actionCreator: (args?: unknown) => ActionPending;
        }) =>
            listenerMiddleware.startListening({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                actionCreator: actionCreator as any,
                effect: async (action, api) => {
                    const { key, useCaseToken, successAction, failureAction, handler } = params;

                    const keyToUse = params.keyFormat ? params.keyFormat(key, action) : key;
                    const meta = (api.getState() as RootState).status[keyToUse];

                    if (!shouldRefetch(meta)) {
                        // Skip this fetch — still cached
                        return;
                    }
                    api.dispatch(setStatus({ key: keyToUse, status: 'loading' }));
                    try {
                        const useCase = container.resolve<UseCase>(useCaseToken);
                        const result = await handler(useCase, action);
                        api.dispatch(successAction(result));
                        api.dispatch(setStatus({ key: keyToUse, status: 'success', cacheDurationMs: params.cacheDurationMs }));
                    } catch (err: unknown) {
                        if (failureAction) {
                            api.dispatch(failureAction(err));
                        }
                        api.dispatch(setStatus({ key: keyToUse, status: 'error', error: err }));
                    }
                },
            });