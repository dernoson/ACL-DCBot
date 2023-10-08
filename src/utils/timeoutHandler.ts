export const createTimeoutHandler = (timeLimitMs: number, onTimeout: () => any): TimeoutHandler => {
    let isCanceled = false;
    setTimeout(() => !isCanceled && onTimeout(), Math.max(timeLimitMs, 0));
    return { cancel: () => (isCanceled = true) };
};

export type TimeoutHandler = {
    cancel: () => void;
};

const handlerTable = new Map<string, TimeoutHandler>();
