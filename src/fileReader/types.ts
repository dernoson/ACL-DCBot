export type PropsInitializers = Record<string, () => BasicType>;

export type FileCacheType<M extends PropsInitializers> = { [K in keyof M]: ReturnType<M[K]> };

export type BasicType = boolean | number | boolean | string | undefined;
