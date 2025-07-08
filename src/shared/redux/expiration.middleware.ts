// store/expireMiddleware.ts
// store/expireMiddleware.ts
import type { Middleware } from '@reduxjs/toolkit';
import { cacheRegistry } from './cache-registry';
import { type OperationMeta, resetStatus } from './status-manager.slice';

const INTERVAL = 10000; // 10s
let lastCheck = 0;

export const expireMiddleware: Middleware = store => next => action => {
    const result = next(action);

    const now = Date.now();
    if (now - lastCheck < INTERVAL) return result;
    lastCheck = now;

    const state = store.getState();
    const status = state.status;

    for (const [key, metaOperation] of Object.entries(status)) {
        const meta = metaOperation as OperationMeta;
        if (!meta.cacheUntil || now < meta.cacheUntil) continue;

        for (const config of cacheRegistry) {
            if (config.match(key)) {
                config.expire(key, store);
                store.dispatch(resetStatus({ key }));
            }
        }
    }

    return result;
};
