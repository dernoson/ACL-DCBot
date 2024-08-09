import { Message } from 'discord.js';
import { MessageResponser } from './types';
import { sellVegetable } from './sellVegetable';
import { grapeFruitify } from './grapeFruitify';
import { chongyue } from './chongyue';
import { saileach } from './saileach';
import { shadow } from './shadow';
import { TimeoutHandler, createRestrictObj, createTimeoutHandler, getObjectEntries } from '../utils';
import { getConfigValue } from '../config';
import { winsok } from './winsok';

export const extraResponse = (message: Message<true>) => {
    const pluginKey = getConfigValue('ResponsePlugin');
    if (typeof pluginKey != 'string') return;
    if (message.content.startsWith('\\')) return;
    if (message.content == '機器人閉嘴') return forceSilence();
    if (isSilence) return;

    return responsePlugins[pluginKey]?.handler(message);
};

const forceSilence = () => {
    timer?.cancel();
    timer = createTimeoutHandler(180 * 1000, () => (isSilence = false));
    if (isSilence) return '阿是要我閉嘴幾次？';
    isSilence = true;
    return Math.random() > 0.5 ? '兇屁阿，好啦我暫時閉嘴行吧' : '好，我閉嘴，我看你BP時怎麼選角';
};

let timer: TimeoutHandler | undefined;

let isSilence = false;

const responsePlugins = createRestrictObj<Record<string, MessageResponser>>()({
    sellVegetable,
    grapeFruitify,
    chongyue,
    saileach,
    shadow,
    winsok
});

export const responsePluginDesc = getObjectEntries(responsePlugins).reduce<Record<ResponsePluginKey, string>>(
    (prev, [key, plugin]) => ({ ...prev, [key]: plugin.desc }),
    {} as Record<ResponsePluginKey, string>
);

export const isResponsePluginKey = (value: any): value is ResponsePluginKey => {
    return value in responsePlugins;
};

export type ResponsePluginKey = keyof typeof responsePlugins;
