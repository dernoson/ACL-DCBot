export const getObjectKeys = <O extends {}>(obj: O) => Object.keys(obj) as (keyof O)[];

export const getObjectEntries = <O extends {}>(obj: O) => Object.entries(obj) as [keyof O, O[keyof O]][];

export const createNoRepeatArr = <T>(operators: T[]) => Array.from(new Set(operators));

export const createRestrictObj = <T>() => {
    return <O extends T>(obj: O) => obj;
};

export const getRandomInt = (range?: number) => Math.floor(Math.random() * (range || 1));
