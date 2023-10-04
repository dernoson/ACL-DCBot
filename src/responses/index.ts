import { Message } from 'discord.js';
import { botEnv } from '../BotEnv';
import { MessageResponser } from './types';
import { sellVegetable } from './sellVegetable';
import { grapeFruitify } from './grapeFruitify';
import { chongyue } from './chongyue';
import { saileach } from './saileach';
import { forceSilence, getSilenceState } from './forceSilence';

export const extraResponse = (message: Message<true>) => {
    const pluginKey = botEnv.get('ResponsePlugin');
    if (typeof pluginKey != 'string') return;

    if (message.content == '機器人閉嘴') return forceSilence();
    if (getSilenceState()) return;

    return responsePlugins[pluginKey]?.handler(message);
};

export const responsePlugins: Record<string, MessageResponser> = {
    sellVegetable,
    grapeFruitify,
    chongyue,
    saileach,
};
