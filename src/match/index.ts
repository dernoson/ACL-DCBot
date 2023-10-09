import { getObjectEntries } from '../utils';
import { createBPHandlers } from './bp';
import { createExchangeHandler } from './exchange';
import { I_MatchHandlers, MatchMode } from './types';

const matchModeMap: Record<MatchMode, I_MatchHandlers<any>> = {
    [MatchMode.normal]: createBPHandlers('預設BP流程', [
        { option: 'ban', amount: 1, teamIndex: 0 },
        { option: 'ban', amount: 1, teamIndex: 1 },
        { option: 'ban', amount: 1, teamIndex: 0 },
        { option: 'ban', amount: 1, teamIndex: 1 },
        { option: 'ban', amount: 1, teamIndex: 0 },
        { option: 'ban', amount: 1, teamIndex: 1 },
        { option: 'pick', amount: 1, teamIndex: 0 },
        { option: 'pick', amount: 2, teamIndex: 1 },
        { option: 'pick', amount: 2, teamIndex: 0 },
        { option: 'pick', amount: 2, teamIndex: 1 },
        { option: 'pick', amount: 2, teamIndex: 0 },
        { option: 'pick', amount: 2, teamIndex: 1 },
        { option: 'pick', amount: 1, teamIndex: 0 },
        { option: 'ban', amount: 1, teamIndex: 1 },
        { option: 'ban', amount: 1, teamIndex: 0 },
        { option: 'ban', amount: 1, teamIndex: 1 },
        { option: 'ban', amount: 1, teamIndex: 0 },
        { option: 'pick', amount: 1, teamIndex: 1 },
        { option: 'pick', amount: 2, teamIndex: 0 },
        { option: 'pick', amount: 2, teamIndex: 1 },
        { option: 'pick', amount: 2, teamIndex: 0 },
        { option: 'pick', amount: 2, teamIndex: 1 },
        { option: 'pick', amount: 2, teamIndex: 0 },
        { option: 'pick', amount: 1, teamIndex: 1 },
    ]),
    [MatchMode.test]: createBPHandlers('測試用簡短BP流程', [
        { option: 'ban', amount: 1, teamIndex: 0 },
        { option: 'ban', amount: 1, teamIndex: 1 },
        { option: 'pick', amount: 1, teamIndex: 0 },
        { option: 'pick', amount: 2, teamIndex: 1 },
        { option: 'pick', amount: 2, teamIndex: 0 },
        { option: 'pick', amount: 1, teamIndex: 1 },
    ]),
    [MatchMode.exchange]: createExchangeHandler('含交換制BP流程', [
        { option: 'ban', amount: 1, teamIndex: 0 },
        { option: 'ban', amount: 1, teamIndex: 1 },
        { option: 'ban', amount: 1, teamIndex: 0 },
        { option: 'ban', amount: 1, teamIndex: 1 },
        { option: 'ban', amount: 1, teamIndex: 0 },
        { option: 'ban', amount: 1, teamIndex: 1 },
        { option: 'pick', amount: 1, teamIndex: 0 },
        { option: 'pick', amount: 2, teamIndex: 1 },
        { option: 'pick', amount: 2, teamIndex: 0 },
        { option: 'pick', amount: 2, teamIndex: 1 },
        { option: 'pick', amount: 2, teamIndex: 0 },
        { option: 'pick', amount: 2, teamIndex: 1 },
        { option: 'pick', amount: 1, teamIndex: 0 },
        { option: 'ban', amount: 1, teamIndex: 1 },
        { option: 'ban', amount: 1, teamIndex: 0 },
        { option: 'ban', amount: 1, teamIndex: 1 },
        { option: 'ban', amount: 1, teamIndex: 0 },
        { option: 'pick', amount: 1, teamIndex: 1 },
        { option: 'pick', amount: 2, teamIndex: 0 },
        { option: 'pick', amount: 2, teamIndex: 1 },
        { option: 'pick', amount: 2, teamIndex: 0 },
        { option: 'pick', amount: 2, teamIndex: 1 },
        { option: 'pick', amount: 2, teamIndex: 0 },
        { option: 'pick', amount: 2, teamIndex: 1 },
        { option: 'pick', amount: 1, teamIndex: 0 },
        { option: 'exchange', amount: 1 },
    ]),
    [MatchMode.testExchange]: createExchangeHandler('測試用含交換制簡短BP流程', [
        { option: 'ban', amount: 1, teamIndex: 0 },
        { option: 'ban', amount: 1, teamIndex: 1 },
        { option: 'pick', amount: 1, teamIndex: 0 },
        { option: 'pick', amount: 1, teamIndex: 1 },
        { option: 'exchange', amount: 1 },
        { option: 'pick', amount: 1, teamIndex: 1 },
        { option: 'pick', amount: 1, teamIndex: 0 },
    ]),
};

export const getMatchHandlers = (key: MatchMode) => matchModeMap[key];

export const matchModeDesc = getObjectEntries(matchModeMap).reduce<Record<MatchMode, string>>(
    (prev, [key, handlers]) => ({ ...prev, [key]: handlers.desc }),
    {} as Record<MatchMode, string>
);

export const isMatchMode = (value: any): value is MatchMode => {
    return value in matchModeMap;
};

export const defaultMatchMode = MatchMode.normal;

export * from './types';
export * from './matchStorage';
export * from './functions';
