import { roleMention } from 'discord.js';
import { createLogString } from '../utils';
import { I_MatchStorage, MatchState, StepHeader } from './types';
import { clearMatchReg } from './matchStorage';

export const checkMatchComplete = (flow: StepHeader[], storage: I_MatchStorage): boolean => {
    const result = storage.stepStorage.length == flow.length;
    if (result) storage.state = MatchState.complete;
    return result;
};

export const createOpeningLog = (desc: string, storage: I_MatchStorage) => {
    const { teams } = storage;
    return createLogString(
        `**===  ${roleMention(teams[0].id)} vs ${roleMention(teams[1].id)} ===**`,
        `此次使用的選角流程為 \`${desc}\``,
        `途中遇到問題，都可以tag主辦方或管理員進行處理。`,
        ''
    );
};

export const removeStep = <S extends StepHeader>(storage: I_MatchStorage<S>) => {
    storage.state = MatchState.pause;
    clearMatchReg(storage.channel);
    const removedStep = storage.stepStorage.pop();
    if (!removedStep) throw '頻道BP流程已無法再往前回復了';
    else return removedStep;
};
