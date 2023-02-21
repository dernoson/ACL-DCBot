import { getObjectKeys } from '../utils';
import { BPOption, createMatchFlowMap, Flow, Match } from './types';

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
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 1 },
    { option: 'exchange', amount: 1 },
];

export const matchFlowMap = createMatchFlowMap({
    normalMatchFlow: {
        desc: '預設BP流程(單方 Pick: 12, Ban: 5)',
        flow: normalMatchFlow,
    },
    testMatchFlow: {
        desc: '測試用簡短BP流程(單方 Pick: 1, Ban: 1)',
        flow: testMatchFlow,
    },
    exchangeMatchFlow: {
        desc: '含交換制BP流程(單方 Pick: 13, Ban: 5, Change: 1)',
        flow: exchangeMatchFlow,
    },
});

export const matchFlowMapKeysArr = getObjectKeys(matchFlowMap);

export const defaultMatchFlowSetting = matchFlowMap['normalMatchFlow'];

export type MatchFlowKey = keyof typeof matchFlowMap;

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
