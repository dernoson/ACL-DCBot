import { roleMention, channelMention, SlashCommandBuilder } from 'discord.js';
import { normalMentionOptions } from '../config/optionSettings';
import type { CommandFunction, OptionType } from '../types';

type Options_Test = {
    integer?: OptionType['Integer'];
    channel?: OptionType['Channel'];
    role?: OptionType['Role'];
    user?: OptionType['User'];
};

const Test: CommandFunction<Options_Test> = async (interaction, { integer, channel, role, user }) => {
    console.log(`integer: ${integer ?? 'undefined'}`);
    console.log(`channel: ${channel?.id ?? 'undefined'}`);
    console.log(`role: ${role?.name ?? 'undefined'}`);
    console.log(`user: ${user?.username ?? 'undefined'}`);

    await interaction.reply('log');
    // setTimeout(() => {
    //     interaction.channel?.send(`Pong! (${delay})`);
    // }, delay * 1000);
};

export default {
    func: Test,
    defs: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test usage')
        .addIntegerOption((option) => option.setName('integer').setDescription('integer'))
        .addChannelOption((option) => option.setName('channel').setDescription('channel'))
        .addRoleOption((option) => option.setName('role').setDescription('role'))
        .addUserOption((option) => option.setName('user').setDescription('user')),
};
