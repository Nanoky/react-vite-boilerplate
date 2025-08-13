import { container } from "../di/container";
import { listenerMiddleware } from "../store/listener";
import type { Module } from "./core/module";
import { ListenerActionHandler } from "./redux/actions-handler";



const TOKENS = {
    ListenerMiddleware: Symbol('ListenerMiddleware'),
    ActionHandler: Symbol('ActionHandler')
}

export const SharedModule: Module = {
    tokens: TOKENS,
    register: () => {
        container.register(TOKENS.ListenerMiddleware, () => listenerMiddleware);
        container.register(TOKENS.ActionHandler, () => new ListenerActionHandler(container.resolve(TOKENS.ListenerMiddleware)));
    }
}