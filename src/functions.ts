import { Guild, GuildTextBasedChannel, PermissionFlagsBits } from 'discord.js';
import { CommandResult } from './commandUtils';

export const commandSuccessResp = (content: string): CommandResult => ({ content, log: content, ephemeral: true });

export const hasSendMessagePermission = (guild: Guild, channel: GuildTextBasedChannel) => {
    const selfMember = guild.members.me;
    if (!selfMember?.permissions.has(PermissionFlagsBits.SendMessages)) return false;
    if (!selfMember?.permissionsIn(channel).has(PermissionFlagsBits.SendMessages)) return false;
    return true;
};
