export const getObjectKeys = <O extends {}>(obj: O) => Object.getOwnPropertyNames(obj) as (keyof O)[];
