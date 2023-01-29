import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, Client } from 'discord.js';
import { OptionType } from './types';

export const getCommandOptions = (
    options: ChatInputCommandInteraction<CacheType>['options'],
    client: Client<true>
): Partial<{ [key: string]: OptionType[keyof OptionType] }> => {
    return options.data.reduce((prev, curr) => {
        switch (curr.type) {
            case ApplicationCommandOptionType.Subcommand:
                return { ...prev, [curr.name]: options.getSubcommand() };
            case ApplicationCommandOptionType.SubcommandGroup:
                return { ...prev, [curr.name]: options.getSubcommandGroup() };
            case ApplicationCommandOptionType.User:
                return { ...prev, [curr.name]: curr.user };
            case ApplicationCommandOptionType.Channel:
                return { ...prev, [curr.name]: client.channels.cache.get(options.getChannel(curr.name, true).id) };
            case ApplicationCommandOptionType.Role:
                return { ...prev, [curr.name]: curr.role };
            case ApplicationCommandOptionType.Mentionable:
                return { ...prev, [curr.name]: options.getMentionable(curr.name) };
            case ApplicationCommandOptionType.Attachment:
                return { ...prev, [curr.name]: options.getAttachment(curr.name) };
            default:
                return { ...prev, [curr.name]: curr.value };
        }
    }, {});
};
