export const onTimeout = (key: string, timeLimitMs: number, onTimeout: () => any) => {
    removeTimeout(key);
    handlerTable.set(key, createTimeoutHandler(timeLimitMs, onTimeout));
};

export const removeTimeout = (key: string) => {
    handlerTable.get(key)?.cancel();
    handlerTable.delete(key);
};

export const createTimeoutHandler = (timeLimitMs: number, onTimeout: () => any): TimeoutHandler => {
    let isCanceled = false;
    setTimeout(() => !isCanceled && onTimeout(), timeLimitMs);
    return { cancel: () => (isCanceled = true) };
};

export type TimeoutHandler = {
    cancel: () => void;
};

const handlerTable = new Map<string, TimeoutHandler>();
