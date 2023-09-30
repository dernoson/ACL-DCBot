import { ChatInputCommandInteraction } from 'discord.js';
import { CommandResult } from '../../commandUtils';

export type ConfigOption = {
    desc: string;
    handler: (ctx: ChatInputCommandInteraction, value: string | undefined) => CommandResult;
};
