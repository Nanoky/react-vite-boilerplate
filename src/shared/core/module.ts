

export interface Module {
    register?: () => void;
    tokens?: Record<string, symbol>;
    initialize?: () => void;
}