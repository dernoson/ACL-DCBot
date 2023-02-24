export const getObjectKeys = <O extends {}>(obj: O) => Object.getOwnPropertyNames(obj) as (keyof O)[];

export function createMutualLock() {
    let locker: Promise<void> | undefined;

    return async function () {
        if (locker) await locker;
        let unlocker: () => void;
        locker = new Promise<void>((resolve) => (unlocker = resolve));
        return function () {
            unlocker();
        };
    };
}
