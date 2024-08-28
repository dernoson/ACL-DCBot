import { commandSuccessResp } from '../commandUtils';
import { setConfigValue } from './functions';
import { ConfigOption } from './types';

export const BPTimeLimit: ConfigOption = {
    desc: 'BP選角時限秒數',
    handler(ctx, value) {
        if (!value) {
            setConfigValue('BPTimeLimit', undefined);
            return commandSuccessResp('BP選角時限秒數：不限');
        } else if (isNaN(+value)) {
            throw '僅可輸入純數字';
        } else if (+value < 1 || +value > 1000) {
            throw '僅可接受 1 ~ 1000 的數值';
        } else {
            const second = +value;
            setConfigValue('BPTimeLimit', second);
            return commandSuccessResp(`BP選角時限秒數： ${second} 秒`);
        }
    },
};
