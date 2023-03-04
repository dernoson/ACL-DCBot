import { GatewayIntentBits, MessageMentionOptions } from 'discord.js';

export const IntentOptions = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent];

export const normalMentionOptions: MessageMentionOptions = {
    parse: ['roles', 'users'],
};
