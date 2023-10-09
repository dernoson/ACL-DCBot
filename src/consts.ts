import { ClientOptions, GatewayIntentBits, MessageMentionOptions } from 'discord.js';

export const normalMentionOptions: MessageMentionOptions = { parse: ['roles', 'users'] };

export const clientOptions: ClientOptions = {
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
};
