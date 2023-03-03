export type StageSetting<O extends string = string> = StageHeader<O> & {
    amount: number;
};

export type StageHeader<O extends string = string> = {
    option: O;
};

export type BPOption = typeof BPOptionKeys[number];

export const BPOptionKeys = ['ban', 'pick'] as const;

export const isBPStageSetting = (stage: StageSetting): stage is StageSetting<BPOption> => BPOptionKeys.includes(stage.option as BPOption);

export type BPStageResult = StageHeader<BPOption> & {
    operators: string[];
};

export const isBPStageResult = (stage: StageHeader): stage is BPStageResult => BPOptionKeys.includes(stage.option as BPOption);

export type BPEXOption = typeof BPEXOptionKeys[number];

export const BPEXOptionKeys = ['ban', 'pick', 'exchange'] as const;

export const isBPEXStageSetting = (stage: StageSetting): stage is StageSetting<BPOption> => BPEXOptionKeys.includes(stage.option as BPEXOption);

export type BPEXStageResult =
    | BPStageResult
    | (StageHeader<'exchange'> & {
          operators: [string[], string[]];
      });

export const isBPEXStageResult = (stage: StageHeader): stage is BPEXStageResult => BPEXOptionKeys.includes(stage.option as BPEXOption);

export enum MatchMode {
    normal = 'normal',
    exchange = 'exchange',
    testExchange = 'testExchange',
    test = 'test',
}

export const calcFlowTotal = (flow: StageSetting[]): { [key: string]: number } => {
    return flow.reduce(
        (prev, stageSetting) => ({ ...prev, [stageSetting.option]: (prev[stageSetting.option] || 0) + stageSetting.amount }),
        {}
    );
};
