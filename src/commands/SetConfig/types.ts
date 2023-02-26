import { CommandContext, CommandResult } from '../../types';

export type ConfigOption = {
    desc: string;
    handler: (ctx: CommandContext, value: string | undefined) => CommandResult;
};
