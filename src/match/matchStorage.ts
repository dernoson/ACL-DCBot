import { BaseGuildTextChannel, Client, Role } from 'discord.js';
import { I_MatchStorage, MatchState } from './types';
import { TimeoutHandler, createTimeoutHandler, getMapValue, getObjectEntries } from '../utils';
import { readJson, writeJson } from '../fileHandlers';

export const createMatchStorage = (channel: BaseGuildTextChannel, teams: [Role, Role], matchMode: string) => {
    const storage: I_MatchStorage = {
        channel,
        teams,
        matchMode,
        state: MatchState.pause,
        stepStorage: [],
    };
    matchStorageTable.set(channel.id, storage);
    return storage;
};

export const getMatchStorage = (channel: BaseGuildTextChannel) => {
    return matchStorageTable.get(channel.id);
};

export const getAllMatchStorage = () => {
    return matchStorageTable.values();
};

export const removeMatchStorage = (channel: BaseGuildTextChannel) => {
    clearMatchReg(channel);
    matchStorageTable.delete(channel.id);
};

export const clearMatchStorage = (): BaseGuildTextChannel[] => {
    const removedChannels: BaseGuildTextChannel[] = [];

    matchStorageTable.forEach(({ channel }) => {
        removedChannels.push(channel);
        clearMatchReg(channel);
    });

    matchStorageTable.clear();

    return removedChannels;
};

export const dumpMatchStorage = async () => {
    const file = [...matchStorageTable.values()].reduce<Record<string, any>>((prev, storage) => {
        return {
            ...prev,
            [storage.channel.id]: {
                matchMode: storage.matchMode,
                stepStorage: storage.stepStorage,
                channel: storage.channel.id,
                teams: storage.teams.map((role) => role.id),
            },
        };
    }, {});

    await writeJson(file, 'match.json');
};

export const recoverMatchStorage = async (client: Client<true>) => {
    const guild = client.guilds.cache.first();
    if (!guild) return;
    const file = await readJson<Record<string, any>>('match.json', () => ({}));
    matchStorageTable.clear();
    getObjectEntries(file).forEach(([channelId, storage]) => {
        matchStorageTable.set(channelId, {
            matchMode: storage.matchMode,
            stepStorage: storage.stepStorage,
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

const matchStorageTable = new Map<string, I_MatchStorage>();

const cacheTable = new Map<string, Map<string, unknown>>();
