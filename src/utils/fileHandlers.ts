import fs from 'fs/promises';

export const readJson = async <D extends Record<string, any>>(fileName: string): Promise<D> => {
    if (!(fileName in lockMap)) lockMap[fileName] = createMutualLock();
    const unlocker = await lockMap[fileName]();
    try {
        const data = await fs.readFile('./files/' + fileName, { encoding: 'utf8' });
        unlocker();
        return JSON.parse(data);
    } finally {
        unlocker();
    }
};

export const writeJson = async (data: any, fileName: string) => {
    if (!(fileName in lockMap)) lockMap[fileName] = createMutualLock();
    const unlocker = await lockMap[fileName]();
    try {
        await fs.writeFile('./files/' + fileName, JSON.stringify(data, null, '\t'));
    } catch (error) {
        console.log('[ writeJson ] error:', error);
    }
    unlocker();
};

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

const lockMap: Record<string, MutualLock> = {};
