import { getObjectKeys } from '../utils';
import { BPEXOption, BPOption, Flow, MatchFlowSetting } from './types';

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

const exchangeMatchFlow: Flow<BPEXOption>[] = [
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

const createMatchFlowMap = <M extends { [key: string]: MatchFlowSetting }>(map: M) => map;

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

export type MatchFlowKey = keyof typeof matchFlowMap;

export const defaultMatchFlowKey: MatchFlowKey = 'normalMatchFlow';

export const calcMatchFlowLimit = <F extends Flow, K extends FlowKeyType<F>>(flow: F[], option: K) => {
    return flow.filter((stage) => option == stage.option).reduce((prev, { amount }) => prev + amount, 0) / 2;
};

export type FlowKeyType<F> = F extends Flow<infer T> ? T : never;
