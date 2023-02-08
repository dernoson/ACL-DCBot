import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, Client } from 'discord.js';
import { botEnv } from './config/botSettings';
import type { OptionType } from './types';

export const getCommandOptions = (options: ChatInputCommandInteraction<CacheType>['options'], client: Client<true>) => {
    const channelCache = client.channels.cache;
    return options.data.reduce<Partial<{ [key: string]: OptionType[keyof OptionType] | null }>>((prev, { type, name, user, role, value }) => {
        switch (type) {
            case ApplicationCommandOptionType.Subcommand:
                return { ...prev, [name]: options.getSubcommand() };
            case ApplicationCommandOptionType.SubcommandGroup:
                return { ...prev, [name]: options.getSubcommandGroup() };
            case ApplicationCommandOptionType.User:
                return { ...prev, [name]: user };
            case ApplicationCommandOptionType.Channel: {
                const channel = options.getChannel(name);
                if (!channel) return prev;
                return { ...prev, [name]: channelCache.get(channel.id) };
            }
            case ApplicationCommandOptionType.Role:
                return { ...prev, [name]: role };
            case ApplicationCommandOptionType.Mentionable:
                return { ...prev, [name]: options.getMentionable(name) };
            case ApplicationCommandOptionType.Attachment:
                return { ...prev, [name]: options.getAttachment(name) };
            default:
                return { ...prev, [name]: value };
        }
    }, {});
};

export const replyCommandError = async (interaction: ChatInputCommandInteraction<CacheType>, commandName: string, content: string) => {
    await interaction.reply({ content, ephemeral: true });
    await botEnv.log(`Error：[${commandName} by ${interaction.user.username}]\n${content}`);
};

export const logCommandResult = async (userName: string, commandName: string, content: string) => {
    await botEnv.log(`[${commandName} by ${userName}]\n${content}`);
};
