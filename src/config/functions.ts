import { readJson, writeJson } from '../utils';
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
    config = await readJson('config.json').catch(() => {
        console.log('未找到 files/config.json，使用初始設定');
        return {};
    });
};

let config: Partial<Config>;
