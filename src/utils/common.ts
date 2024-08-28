import { Guild, GuildTextBasedChannel, PermissionFlagsBits } from 'discord.js';

export const getRandomInt = (range?: number) => Math.floor(Math.random() * (range || 1));

export const getMapValue = <K, V>(map: Map<K, V>, key: K, init: (key: K) => V): V => {
    if (!map.has(key)) {
        const newValue = init(key);
        map.set(key, newValue);
        return newValue;
    } else {
        return map.get(key) as V;
    }
};

export const createLogString = (...strs: (string | undefined)[]) => strs.filter((str) => typeof str == 'string').join('\n');

export const hasSendMessagePermission = (guild: Guild, channel: GuildTextBasedChannel) => {
    const selfMember = guild.members.me;
    if (!selfMember?.permissions.has(PermissionFlagsBits.SendMessages)) return false;
    if (!selfMember?.permissionsIn(channel).has(PermissionFlagsBits.SendMessages)) return false;
    return true;
};
