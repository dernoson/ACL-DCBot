import { Message } from 'discord.js';
import { botEnv } from '../config/botSettings';
import { sellVegetable } from './sellVegetable';
import { grapeFruitify } from './grapeFruitify';
import { MessageResponser } from './types';

export const extraResponse = (message: Message<true>) => {
    const pluginKey = botEnv.get('ResponsePlugin');
    if (typeof pluginKey != 'string') return;
    const handler = responsePlugins[pluginKey]?.handler;
    if (!handler) return;
    return handler(message);
};

export const responsePlugins: { [key: string]: MessageResponser | undefined } = {
    sellVegetable,
    grapeFruitify,
};
