import { CommandContext, CommandResult } from '../../types';

export type ConfigOption = {
    desc: string;
    handler: (replier: CommandContext, value: string | undefined) => Promise<CommandResult>;
};
