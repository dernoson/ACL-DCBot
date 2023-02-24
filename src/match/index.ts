import { BP, Match } from './types';

export const matchMap = new Map<string, Match>();

export const banpickMap = new Map<string, BP>();

export const exchangeMap = new Map<string, [string[], string[]]>();

export { Match, MatchFlowSetting, Flow, BPOption, BPEXOption, MatchState, BP } from './types';
export { matchFlowMap, matchFlowMapKeysArr, MatchFlowKey, defaultMatchFlowKey, calcMatchFlowLimit, FlowKeyType } from './matchSettings';
export { createMatch, getDuplicate, getMatchStageDescription, setMatchStageNext, setBPTimeLimit } from './functions';
