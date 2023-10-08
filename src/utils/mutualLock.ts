export const createMutualLock = (): MutualLock => {
    let locker: Promise<void> | undefined;
    return async () => {
        if (locker) await locker;
        let unlocker: () => void;
        locker = new Promise<void>((resolve) => (unlocker = resolve));
        return () => unlocker?.();
    };
};

export type MutualLock = () => Promise<() => void>;
