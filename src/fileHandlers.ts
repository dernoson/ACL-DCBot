import dayjs from 'dayjs';
import fs from 'fs/promises';
import { MutualLock, createMutualLock } from './utils';

export const writeError = (error: any) => {
    const filename = 'errorLog-' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.json';
    console.log('ERROR:', filename);
    writeJson(error, filename);
};

export const readJson = async <D extends Record<string, any>>(fileName: string, init: () => D): Promise<D> => {
    if (!(fileName in lockMap)) lockMap[fileName] = createMutualLock();
    const unlocker = await lockMap[fileName]();
    try {
        const data = await fs.readFile('./files/' + fileName, { encoding: 'utf8' });
        unlocker();
        return JSON.parse(data);
    } catch (error) {
        console.log('[ readJson ] error:', error);
        unlocker();
        return init();
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

const lockMap: Record<string, MutualLock> = {};
