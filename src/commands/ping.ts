import { roleMention, channelMention, SlashCommandBuilder, Channel, Role } from 'discord.js';
import { CommandFunction } from '../types';

type Options_Ping = {
    delay: number;
    channel: Channel;
    role: Role;
};

const Ping: CommandFunction<Options_Ping> = async (interaction, { delay, channel, role }) => {
    await interaction.reply(`Set success! ${channelMention(channel.id)} ${roleMention(role.id)}`);
    setTimeout(() => {
        interaction.channel?.send(`Pong! (${delay})`);
    }, delay * 1000);
};

export default {
    func: Ping,
    defs: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .addIntegerOption((option) => option.setName('delay').setDescription('delay seconds').setRequired(true))
        .addChannelOption((option) => option.setName('channel').setDescription('test channel').setRequired(true))
        .addRoleOption((option) => option.setName('role').setDescription('test role').setRequired(true)),
};
