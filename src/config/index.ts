import { createRestrictObj, getObjectEntries } from '../utils';
import { ConfigOption } from './types';
import { BPTimePrepare } from './BPTimePrepare';
import { BPTimeLimit } from './BPTimeLimit';
import { BPTimeAlert } from './BPTimeAlert';
import { MatchFlow } from './MatchFlow';
import { ResponsePlugin } from './ResponsePlugin';

export const configOptions = createRestrictObj<Record<string, ConfigOption>>()({
    BPTimePrepare,
    BPTimeLimit,
    BPTimeAlert,
    MatchFlow,
    ResponsePlugin,
});

export const configOptionDescs = getObjectEntries(configOptions).reduce(
    (prev, [value, name]) => ({ ...prev, [value]: name.desc }),
    {} as Record<keyof typeof configOptions, string>
);

export * from './functions';
export * from './env';
