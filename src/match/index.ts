import { MatchMode } from './types';
import { Match, ModeSetting } from './match';
import { exchangeFlow, normalFlow, testFlow } from './flows';
import { createOnSelect_ModeBP, createLogTotal_ModeBP, createLogStart_ModeBP, BP_onRemove } from './bp';

export const matchMap = new Map<string, Match>();

export const matchModeMap: { [key in keyof typeof MatchMode]: ModeSetting } = {
    normal: {
        desc: '預設BP流程',
        flow: normalFlow,
        logTotal: createLogTotal_ModeBP(normalFlow),
        logStart: createLogStart_ModeBP(normalFlow),
        onRemove: BP_onRemove,
        onSelect: createOnSelect_ModeBP(normalFlow),
    },
    exchange: {
        desc: '含交換制BP流程',
        flow: exchangeFlow,
        logTotal: () => '',
        logStart: () => '',
        onRemove: () => '',
        onSelect: () => '',
    },
    test: {
        desc: '測試用簡短BP流程',
        flow: testFlow,
        logTotal: createLogTotal_ModeBP(testFlow),
        logStart: createLogStart_ModeBP(testFlow),
        onRemove: BP_onRemove,
        onSelect: createOnSelect_ModeBP(testFlow),
    },
};

export const defaultMatchMode = MatchMode.normal;

export { StageSetting, StageHeader, BPOption, BPEXOption, MatchMode, isBPStageSetting, isBPStageResult } from './types';
export { Match, MatchState } from './match';
