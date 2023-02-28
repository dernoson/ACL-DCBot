export type FlowSetting<T extends string = string> = {
    desc: string;
    content: StageSetting<T>[];
};

export type StageSetting<O extends string = string> = StageHeader<O> & {
    amount: number;
};

export type StageHeader<O extends string = string> = {
    option: O;
};

export type BPOption = 'ban' | 'pick';

export type BPEXOption = BPOption | 'exchange';
