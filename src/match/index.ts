import { matchFlowMap } from './matchFlow';
import { MatchMode } from './types';

export const getMatchHandlers = (key: MatchMode) => matchFlowMap[key];

export const matchModeDesc = Object.entries(matchFlowMap).reduce(
    (prev, [key, handlers]) => ({ ...prev, [key]: handlers.desc }),
    {} as Record<MatchMode, string>
);

export const isMatchMode = (value: any): value is MatchMode => {
    return value in matchFlowMap;
};

export const defaultMatchMode = MatchMode.normal;

export * from './matchFlow';
export * from './types';
export * from './matchStorage';
export * from './functions';
