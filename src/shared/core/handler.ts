
export interface Handler<T = void> {
    handle(data: T): void;
}