import { BaseGuildTextChannel, Role } from 'discord.js';
import { I_MatchStorage, MatchMode, MatchState } from './types';
import { TimeoutHandler, createTimeoutHandler, getMapValue, getObjectEntries } from '../utils';
import { readJson, writeJson } from '../fileHandlers';
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
        channel.permissionOverwrites.create(team, channelPermission);
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
        channel.permissionOverwrites.delete(team);
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
    const file = await readJson<Record<string, any>>('match.json', () => ({}));
    matchStorageTable.clear();
    getObjectEntries(file).forEach(([channelId, storage]) => {
        matchStorageTable.set(channelId, {
            matchMode: storage.matchMode,
            stepStorage: storage.stepStorage,
            restRoles: storage.restRoles,
            state: MatchState.pause,
            channel: guild.channels.cache.get(storage.channel) as any,
            teams: storage.teams.map((id: string) => guild.roles.cache.get(id)),
        });
    });
};

export const setMatchTimeout = (channel: BaseGuildTextChannel, key: string, timeLimitMs: number, fn: () => any) => {
    const matchTimeoutMap = getMapValue(timeoutHandlerTable, channel.id, () => new Map<string, TimeoutHandler>());
    matchTimeoutMap.get(key)?.cancel();
    matchTimeoutMap.set(key, createTimeoutHandler(timeLimitMs, fn));
};

export const removeMatchTimeout = (channel: BaseGuildTextChannel, key?: string) => {
    const timeoutHandlers = timeoutHandlerTable.get(channel.id);
    if (!timeoutHandlers) return;
    if (!key) {
        timeoutHandlers.forEach((handler) => handler.cancel());
        timeoutHandlers.clear();
    } else {
        timeoutHandlers.get(key)?.cancel();
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
    timeoutHandlerTable.get(channelId)?.forEach((handler) => handler.cancel());
    timeoutHandlerTable.delete(channelId);
    cacheTable.delete(channelId);
};

const timeoutHandlerTable = new Map<string, Map<string, TimeoutHandler>>();

const matchStorageTable = new Map<string, I_MatchStorage<any>>();

const cacheTable = new Map<string, Map<string, unknown>>();
