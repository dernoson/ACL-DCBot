import { Awaitable } from 'discord.js';
import { CommandReplier } from '../../types';

export type ConfigOption = {
    desc: string;
    handler: (replier: CommandReplier, value: string | undefined) => Awaitable<void>;
};
