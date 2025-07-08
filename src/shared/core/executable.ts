

export interface Executable<TInput, TOutput> {
    execute(params: TInput): Promise<TOutput>;
}