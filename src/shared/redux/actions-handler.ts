/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ListenerEffectAPI, ThunkDispatch, UnknownAction, ListenerMiddlewareInstance } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../../store";
import { type OperationMeta, setStatus } from "./status-manager.slice";

type TypeAction = Parameters<AppDispatch>[0];

type ListenerAPI = ListenerEffectAPI<unknown, ThunkDispatch<unknown, unknown, UnknownAction>, unknown>
export interface ActionHandler {
    register(key: string, actionCreator: (data: any) => TypeAction): void;
    unregister(key: string): void;
    on<Payload>(key: string, callback: (payload: Payload, api: ListenerAPI) => void): void;
    startLoading(key: string, api: ListenerAPI): void;
    succeed(key: string, api: ListenerAPI, cacheDurationMs?: number): void;
    fail(key: string, api: ListenerAPI, error?: any): void;
    idle(key: string, api: ListenerAPI): void;
    stillCached(key: string, api: ListenerAPI): boolean;
}

export class ListenerActionHandler implements ActionHandler {
    private _registry = new Map<string, (data: any) => TypeAction>();
    private _listener: ListenerMiddlewareInstance<unknown, ThunkDispatch<unknown, unknown, UnknownAction>, unknown>;
    constructor(listener: ListenerMiddlewareInstance<unknown, ThunkDispatch<unknown, unknown, UnknownAction>, unknown>) { 
        this._listener = listener;
    }

    register(key: string, actionCreator: (data: any) => TypeAction) {
        this._registry.set(key, actionCreator);
    }

    unregister(key: string) {
        this._registry.delete(key);
    }

    private shouldRefetch(meta: OperationMeta | undefined): boolean {
        if (!meta?.cacheUntil) return true;
        return Date.now() > meta.cacheUntil;
    };

    stillCached(key: string, api: ListenerAPI): boolean {
        const keyToUse = key;
        const meta = (api.getState() as RootState).status[keyToUse];
        console.info('stillCached', keyToUse, meta, this.shouldRefetch(meta));
        if (!this.shouldRefetch(meta)) {
            // Skip this fetch — still cached
            return true;
        }
        return false;
    }
    startLoading(key: string, api: ListenerAPI) {
        api.dispatch(setStatus({ key: key, status: 'loading' }));
    }
    succeed(key: string, api: ListenerAPI, cacheDurationMs?: number) {
        api.dispatch(setStatus({ key, status: 'success', cacheDurationMs: cacheDurationMs }));
    }
    fail(key: string, api: ListenerAPI, error?: any) {
        api.dispatch(setStatus({ key, status: 'error', error }));
    }
    idle(key: string, api: ListenerAPI) {
        api.dispatch(setStatus({ key, status: 'idle' }));
    }

    on<Payload>(
        key: string,
        callback: (payload: Payload, api: ListenerAPI) => void
    ) {
        const actionCreator = this._registry.get(key);
        if (!actionCreator) {
            throw new Error(`Action ${key} is not registered`);
        }

        this._listener.startListening({
            actionCreator: actionCreator as any,
            effect: async (action, api) => {
                callback(action.payload as Payload, api);
            },
        });
    }
}