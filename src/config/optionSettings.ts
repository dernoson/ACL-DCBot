import { GatewayIntentBits, MessageMentionOptions } from 'discord.js';

export const IntentOptions = [GatewayIntentBits.Guilds];

export const normalMentionOptions: MessageMentionOptions = {
    parse: ['roles', 'users'],
};
