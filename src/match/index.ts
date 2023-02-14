import type { BPOption, Flow, Match } from './types';

const normalMatchFlow: Flow<BPOption>[] = [
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'pick', amount: 1 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'pick', amount: 1 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 1 },
];

const testMatchFlow: Flow<BPOption>[] = [
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'pick', amount: 1 },
    { option: 'pick', amount: 1 },
];

const exchangeMatchFlow: Flow<BPOption | 'exchange'>[] = [
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'pick', amount: 1 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'pick', amount: 1 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 1 },
];

export const matchFlowSetting = {
    normalMatchFlow,
    testMatchFlow,
    exchangeMatchFlow,
};

export const matchMap = new Map<string, Match>();

export { Match, MatchState, BP, BPOption, Flow } from './types';
export {
    genMatch,
    genBP,
    getDuplicate,
    calcMatchFlow,
    getOperatorListDescription,
    getMatchStageDescription,
    setMatchStageNext,
    setBPTimeLimit,
} from './functions';
