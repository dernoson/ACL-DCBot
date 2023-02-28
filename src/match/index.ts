import { Match } from './match';

export const matchMap = new Map<string, Match>();

export { FlowSetting, StageSetting, StageHeader, BPOption, BPEXOption } from './types';
export { Match, createMatch, sendMatchChannel, createMatchTimeout, getNowTeam, getNowStageSetting, MatchState, StageHandler } from './match';

export {
    flowSettingMap,
    FlowSettingKey,
    flowSettingKeysArr,
    defaultFlowSettingKey,
    isFlowSettingKey,
    getFlowContent,
    getFlowDesc,
    calcFlowLimit,
} from './flowSettings';
