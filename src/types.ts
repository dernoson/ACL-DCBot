import { Awaitable, CacheType, ChatInputCommandInteraction } from 'discord.js';

export type CommandFunction = (interaction: ChatInputCommandInteraction<CacheType>) => Awaitable<void>;
