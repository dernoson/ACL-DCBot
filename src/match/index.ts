import { MatchMode } from './types';
import { Match, ModeSetting } from './match';
import { exchangeFlow, normalFlow, testExchangeFlow, testFlow } from './flows';
import { createOnSelect_ModeBP, createLogTotal_ModeBP, createOnStart_ModeBP, BP_onRemove } from './bp';
import { BPEX_onRemove, createOnStart_ModeBPEX, createLogTotal_ModeBPEX, createOnSelect_ModeBPEX } from './exchange';

export const matchMap = new Map<string, Match>();

export const matchModeMap: { [key in keyof typeof MatchMode]: ModeSetting } = {
    normal: {
        desc: '預設BP流程(單方 ban: 5, pick: 12)',
        flow: normalFlow,
        logTotal: createLogTotal_ModeBP(normalFlow),
        onStart: createOnStart_ModeBP(normalFlow),
        onRemove: BP_onRemove,
        onSelect: createOnSelect_ModeBP(normalFlow),
    },
    exchange: {
        desc: '含交換制BP流程(單方 ban: 5, pick: 13, exchange: 1)',
        flow: exchangeFlow,
        logTotal: createLogTotal_ModeBPEX(exchangeFlow),
        onStart: createOnStart_ModeBPEX(exchangeFlow),
        onRemove: BPEX_onRemove,
        onSelect: createOnSelect_ModeBPEX(exchangeFlow),
    },
    testExchange: {
        desc: '測試用含交換制簡短BP流程(單方 ban: 1, pick: 2, exchange: 1)',
        flow: testExchangeFlow,
        logTotal: createLogTotal_ModeBPEX(testExchangeFlow),
        onStart: createOnStart_ModeBPEX(testExchangeFlow),
        onRemove: BPEX_onRemove,
        onSelect: createOnSelect_ModeBPEX(testExchangeFlow),
    },
    test: {
        desc: '測試用簡短BP流程(單方 ban: 1, pick: 1)',
        flow: testFlow,
        logTotal: createLogTotal_ModeBP(testFlow),
        onStart: createOnStart_ModeBP(testFlow),
        onRemove: BP_onRemove,
        onSelect: createOnSelect_ModeBP(testFlow),
    },
};

export const defaultMatchMode = MatchMode.normal;

export { StageSetting, StageHeader, BPOption, BPEXOption, MatchMode, isBPStageSetting, isBPStageResult } from './types';
export { Match, MatchState } from './match';
