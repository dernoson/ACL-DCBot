import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { CommandExecute, CommandFunction, CommandResult } from './types';
import { normalMentionOptions } from '../consts';
import { logCommandResult } from '../config';

export const createCommandExecute = (fn: CommandFunction): CommandExecute => {
    return async (ctx) => {
        const { options, commandName, user } = ctx;

        try {
            const result = fn(ctx, getCommandOptions(options));
            const replyOption: Exclude<CommandResult, string> = typeof result == 'string' ? { content: result } : result;
            const { log } = replyOption;
            log && logCommandResult(commandName, 'success', user.username, log);
            await ctx.reply({ allowedMentions: normalMentionOptions, ...replyOption });
        } catch (error) {
            if (typeof error == 'string') {
                logCommandResult(commandName, 'fail', user.username, error);
                await ctx.reply({ content: '！！！指令失敗！！！\n' + error, ephemeral: true });
            } else {
                await ctx.reply({ content: '擺爛啦！德諾索又要修機器人啦', ephemeral: true });
                throw error;
            }
        }
    };
};

const getCommandOptions = (options: ChatInputCommandInteraction['options']) => {
    return options.data.reduce<Record<string, any>>((prev, optionValue) => {
        const { type, name } = optionValue;
        switch (type) {
            case ApplicationCommandOptionType.User:
                return { ...prev, [name]: options.getUser(name, true) };
            case ApplicationCommandOptionType.Channel:
                return { ...prev, [name]: options.getChannel(name, true) };
            case ApplicationCommandOptionType.Role:
                return { ...prev, [name]: options.getRole(name, true) };
            case ApplicationCommandOptionType.Mentionable:
                return { ...prev, [name]: options.getMentionable(name, true) };
            case ApplicationCommandOptionType.Attachment:
                return { ...prev, [name]: options.getAttachment(name, true) };
            default:
                return { ...prev, [name]: optionValue.value };
        }
    }, {});
};
