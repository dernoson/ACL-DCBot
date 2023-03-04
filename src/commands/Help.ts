import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CommandContext } from '../types';

export const Help = (ctx: CommandContext, defs: Partial<SlashCommandBuilder>[]) => {
    const embed = new EmbedBuilder()
        .setTitle('Arknights ACL Bot')
        .setDescription('機器人可使用指令')
        .addFields(...defs.map((d) => ({ name: d.name!, value: d.description! })))
        .setTimestamp()
        .setColor('DarkAqua');

    ctx.reply({ embeds: [embed], ephemeral: true });
};

export const helpDefs = new SlashCommandBuilder().setName('help').setDescription('機器人講解');
