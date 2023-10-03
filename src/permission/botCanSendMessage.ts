import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';

export const botCanSendMessage = (ctx: ChatInputCommandInteraction) => {
    if (!ctx.inGuild() || !ctx.guild || !ctx.channel) return false;
    const { guild, channel } = ctx;
    const selfMember = guild.members.me;
    if (!selfMember?.permissions.has(PermissionFlagsBits.SendMessages)) return false;
    if (!selfMember?.permissionsIn(channel).has(PermissionFlagsBits.SendMessages)) return false;
    return true;
};
