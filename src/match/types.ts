export type StageSetting<O extends string = string> = StageHeader<O> & {
    amount: number;
};

export type StageHeader<O extends string = string> = {
    option: O;
};

export type BPOption = 'ban' | 'pick';

export const isBPStageSetting = (stage: StageSetting): stage is StageSetting<BPOption> => stage.option == 'ban' || stage.option == 'pick';

export type BPStageResult = StageHeader<BPOption> & {
    operators: string[];
};

export const isBPStageResult = (stage: StageHeader): stage is BPStageResult => stage.option == 'ban' || stage.option == 'pick';

export type BPEXOption = BPOption | 'exchange';

export enum MatchMode {
    normal = 'normal',
    exchange = 'exchange',
    test = 'test',
}

export const calcFlowTotal = (flow: StageSetting[]): { [key: string]: number } => {
    return flow.reduce(
        (prev, stageSetting) => ({ ...prev, [stageSetting.option]: (prev[stageSetting.option] || 0) + stageSetting.amount }),
        {}
    );
};
