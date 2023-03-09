import { Message } from 'discord.js';
import { botEnv } from '../config/botSettings';
import { MessageResponser } from './types';
import { sellVegetable } from './sellVegetable';
import { grapeFruitify } from './grapeFruitify';
import { chongyue } from './chongyue';
import { saileach } from './saileach';
import { forceSilence, getSilenceState } from './forceSilence';

export const extraResponse = (message: Message<true>) => {
    if (message.content == '機器人閉嘴') return forceSilence();
    if (getSilenceState()) return;
    const pluginKey = botEnv.get('ResponsePlugin');
    if (typeof pluginKey != 'string') return;
    const handler = responsePlugins[pluginKey]?.handler;
    if (!handler) return;
    return handler(message);
};

export const responsePlugins: { [key: string]: MessageResponser | undefined } = {
    sellVegetable,
    grapeFruitify,
    chongyue,
    saileach,
};
