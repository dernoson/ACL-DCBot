import { I_MatchStorage, MatchState, StepHeader } from './types';
import { clearMatchReg, dumpMatchStorage } from './matchStorage';

export const checkMatchStepChange = (flow: StepHeader[], storage: I_MatchStorage): boolean => {
    const result = storage.stepStorage.length == flow.length;
    if (result) storage.state = MatchState.complete;
    else storage.state = MatchState.running;
    dumpMatchStorage();
    clearMatchReg(storage.channel);
    return result;
};

export const removeStep = <S extends StepHeader>(storage: I_MatchStorage<S>) => {
    storage.state = MatchState.pause;
    clearMatchReg(storage.channel);
    const removedStep = storage.stepStorage.pop();
    if (!removedStep) throw '頻道BP流程已無法再往前回復了';
    else {
        dumpMatchStorage();
        return removedStep;
    }
};
