
export function buildKey(operation: string, params: unknown): string {
    let paramsStr = '';
    if (params instanceof Array) {
        paramsStr = JSON.stringify(params);
    }
    else if (params instanceof Object) {
        paramsStr = JSON.stringify(params);
    }
    else {
        paramsStr = params as string;
    }
    return `${operation}:${paramsStr}`;
}

export function breakKey(key: string): {
    operation: string,
    params: unknown
} {
    const parts = key.split(':');
    return {
        operation: parts[0],
        params: parts[1]
    };
}
