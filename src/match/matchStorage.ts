import { BaseGuildTextChannel, Role } from 'discord.js';
import { I_MatchStorage, MatchMode, MatchState } from './types';
import { getMapValue, readJson, writeJson } from '../utils';
import { channelPermission } from '../consts';
import { getEnv } from '../config';

export const createMatchStorage = (channel: BaseGuildTextChannel, teams: [Role, Role], matchMode: MatchMode) => {
    const storage: I_MatchStorage = {
        channel,
        teams,
        matchMode,
        state: MatchState.pause,
        stepStorage: [],
        restRoles: {},
    };

    channel.guild.members.fetch().then((members) => {
        members.forEach((member) => {
            teams.forEach((team) => {
                const memberRoles = member.roles.cache;
                if (!memberRoles.has(team.id)) return;

                storage.restRoles[member.id] = [...memberRoles.keys()].filter((id) => id != team.id);

                member.roles.set([team]).catch((error) => console.log(error));
            });
        });

        dumpMatchStorage();
    });

    teams.forEach((team) => {
        channel.permissionOverwrites.create(team, channelPermission).catch((error) => console.log(error));
    });

    matchStorageTable.set(channel.id, storage);
    dumpMatchStorage();
    return storage;
};

export const getMatchStorage = (channel: BaseGuildTextChannel) => {
    return matchStorageTable.get(channel.id);
};

export const getAllMatchStorage = () => {
    return matchStorageTable.values();
};

export const removeMatchStorage = (channel: BaseGuildTextChannel) => {
    const storage = getMatchStorage(channel);
    if (!storage) return;
    const { teams, restRoles } = storage;

    channel.guild.members.fetch().then((members) => {
        members.forEach((member) => {
            const restRole = restRoles[member.id];
            if (!restRole) return;

            member.roles.add(restRole).catch((error) => console.log(error));
        });
    });

    teams.forEach((team) => {
        channel.permissionOverwrites.delete(team).catch((error) => console.log(error));
    });

    clearMatchReg(channel);
    matchStorageTable.delete(channel.id);
    dumpMatchStorage();
};

export const dumpMatchStorage = async () => {
    const file = [...matchStorageTable.values()].reduce<Record<string, any>>((prev, storage) => {
        return {
            ...prev,
            [storage.channel.id]: {
                matchMode: storage.matchMode,
                stepStorage: storage.stepStorage,
                restRoles: storage.restRoles,
                channel: storage.channel.id,
                teams: storage.teams.map((role) => role.id),
            },
        };
    }, {});

    await writeJson(file, 'match.json');
};

export const recoverMatchStorage = async () => {
    const { guild } = getEnv();
    if (!guild) return;
    try {
        const file = await readJson<Record<string, any>>('match.json');

        console.log('已找到 files/match.json，嘗試恢復紀錄');

        matchStorageTable.clear();
        Object.entries(file).forEach(([channelId, storage]) => {
            matchStorageTable.set(channelId, {
                matchMode: storage.matchMode,
                stepStorage: storage.stepStorage,
                restRoles: storage.restRoles,
                state: MatchState.pause,
                channel: guild.channels.cache.get(storage.channel) as any,
                teams: storage.teams.map((id: string) => guild.roles.cache.get(id)),
            });
        });
    } catch {}
};

export const setMatchTimeout = (channel: BaseGuildTextChannel, key: string, timeLimitMs: number, fn: () => any) => {
    const matchTimeoutMap = getMapValue(timeoutHandlerTable, channel.id, () => new Map<string, NodeJS.Timeout>());
    const prevTimer = matchTimeoutMap.get(key);
    prevTimer && clearTimeout(prevTimer);
    matchTimeoutMap.set(key, setTimeout(fn, timeLimitMs));
};

export const removeMatchTimeout = (channel: BaseGuildTextChannel, key?: string) => {
    const timeoutHandlers = timeoutHandlerTable.get(channel.id);
    if (!timeoutHandlers) return;
    if (!key) {
        timeoutHandlers.forEach((handler) => clearTimeout(handler));
        timeoutHandlers.clear();
    } else {
        const targetTimer = timeoutHandlers.get(key);
        if (!targetTimer) return;
        clearTimeout(targetTimer);
        timeoutHandlers.delete(key);
    }
};

export const setMatchCache = (channel: BaseGuildTextChannel, key: string, value: unknown) => {
    const cacheMap = getMapValue(cacheTable, channel.id, () => new Map<string, unknown>());
    cacheMap.set(key, value);
};

export const getMatchCache = <V>(channel: BaseGuildTextChannel, key: string, init: () => V): V => {
    const cacheMap = getMapValue(cacheTable, channel.id, () => new Map<string, unknown>());
    return getMapValue(cacheMap, key, init) as V;
};

export const clearMatchReg = (channel: BaseGuildTextChannel) => {
    const channelId = channel.id;
    timeoutHandlerTable.get(channelId)?.forEach((handler) => clearTimeout(handler));
    timeoutHandlerTable.delete(channelId);
    cacheTable.delete(channelId);
};

const timeoutHandlerTable = new Map<string, Map<string, NodeJS.Timeout>>();

const matchStorageTable = new Map<string, I_MatchStorage<any>>();

const cacheTable = new Map<string, Map<string, unknown>>();
