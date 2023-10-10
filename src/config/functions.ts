import { readJson, writeJson } from '../fileHandlers';
import { Config } from './types';

export const getConfigValue = <K extends keyof Config>(key: K) => {
    return config[key];
};

export const setConfigValue = <K extends keyof Config>(key: K, value: Config[K] | undefined) => {
    config[key] = value;
    writeJson(config, 'config.json');
};

export const getConfig = () => {
    return config;
};

export const readConfig = async () => {
    config = await readJson('config.json', () => ({}));
};

let config: Partial<Config>;
