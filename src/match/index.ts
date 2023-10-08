import { createRestrictObj } from '../utils';
import { createBPHandlers } from './bp';
import { createExchangeHandler } from './exchange';
import { I_MatchHandlers } from './types';

export const matchModeMap = createRestrictObj<Record<string, I_MatchHandlers<any>>>()({
    normal: createBPHandlers('預設BP流程', [
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
    test: createBPHandlers('測試用簡短BP流程', [
        { option: 'ban', amount: 1, teamIndex: 0 },
        { option: 'ban', amount: 1, teamIndex: 1 },
        { option: 'pick', amount: 1, teamIndex: 0 },
        { option: 'pick', amount: 2, teamIndex: 1 },
        { option: 'pick', amount: 2, teamIndex: 0 },
        { option: 'pick', amount: 1, teamIndex: 1 },
    ]),
    exchange: createExchangeHandler('含交換制BP流程', [
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
    testExchange: createExchangeHandler('測試用含交換制簡短BP流程', [
        { option: 'ban', amount: 1, teamIndex: 0 },
        { option: 'ban', amount: 1, teamIndex: 1 },
        { option: 'pick', amount: 1, teamIndex: 0 },
        { option: 'pick', amount: 1, teamIndex: 1 },
        { option: 'exchange', amount: 1 },
        { option: 'pick', amount: 1, teamIndex: 1 },
        { option: 'pick', amount: 1, teamIndex: 0 },
    ]),
});

export type MatchMode = keyof typeof matchModeMap;

export const defaultMatchMode: MatchMode = 'normal';

export * from './types';
export * from './matchStorage';
export * from './functions';
