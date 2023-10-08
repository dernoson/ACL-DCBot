export const getObjectKeys = <O extends {}>(obj: O) => Object.keys(obj) as (keyof O)[];

export const getObjectEntries = <O extends {}>(obj: O) => Object.entries(obj) as [keyof O, O[keyof O]][];

export const createNoRepeatArr = <T>(operators: T[]) => Array.from(new Set(operators));

export const createRestrictObj = <T>() => {
    return <O extends T>(obj: O) => obj;
};

export const getRandomInt = (range?: number) => Math.floor(Math.random() * (range || 1));

export const getMapValue = <K, V>(map: Map<K, V>, key: K, init: (key: K) => V): V => {
    if (!map.has(key)) {
        const newValue = init(key);
        map.set(key, newValue);
        return newValue;
    } else {
        return map.get(key) as V;
    }
};

export const createLogString = (...strs: (string | undefined)[]) => strs.filter((str) => typeof str == 'string').join('\n');
