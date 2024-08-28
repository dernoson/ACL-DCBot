import { ConfigOption } from './types';
import { BPTimePrepare } from './BPTimePrepare';
import { BPTimeLimit } from './BPTimeLimit';
import { BPTimeAlert } from './BPTimeAlert';
import { ResultSubmitLimit } from './RecordSubmitLimit';
import { MatchFlow } from './MatchFlow';

export const configOptions: Record<string, ConfigOption> = {
    BPTimePrepare,
    BPTimeLimit,
    BPTimeAlert,
    ResultSubmitLimit,
    MatchFlow,
    // ResponsePlugin,
};

export * from './functions';
export * from './env';
