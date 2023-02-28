import { createRestrictObj, getObjectKeys } from '../utils';
import { BPEXOption, BPOption, StageSetting, FlowSetting } from './types';

const normalFlow: StageSetting<BPOption>[] = [
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

const testFlow: StageSetting<BPOption>[] = [
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'pick', amount: 1 },
    { option: 'pick', amount: 1 },
];

const exchangeFlow: StageSetting<BPEXOption>[] = [
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

export const flowSettingMap = createRestrictObj<{ [key: string]: FlowSetting }>()({
    normalFlow: {
        desc: '預設BP流程(單方 Pick: 12, Ban: 5)',
        content: normalFlow,
    },
    testFlow: {
        desc: '測試用簡短BP流程(單方 Pick: 1, Ban: 1)',
        content: testFlow,
    },
    exchangeFlow: {
        desc: '含交換制BP流程(單方 Pick: 13, Ban: 5, Change: 1)',
        content: exchangeFlow,
    },
});

export type FlowSettingKey = keyof typeof flowSettingMap;

export const flowSettingKeysArr = getObjectKeys(flowSettingMap);

export const defaultFlowSettingKey: FlowSettingKey = 'normalFlow';

export const isFlowSettingKey = (key: any): key is FlowSettingKey => flowSettingKeysArr.includes(key);

export const getFlowContent = <K extends FlowSettingKey>(key: K): typeof flowSettingMap[K]['content'] => flowSettingMap[key].content;

export const getFlowDesc = (key: FlowSettingKey) => flowSettingMap[key].desc;

export const calcFlowLimit = (key: FlowSettingKey, option: string) => {
    const content = getFlowContent(key);
    return content.filter((stage) => option == stage.option).reduce((prev, { amount }) => prev + amount, 0) / 2;
};
