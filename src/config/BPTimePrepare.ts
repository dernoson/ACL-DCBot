import { commandSuccessResp } from '../functions';
import { setConfigValue } from './functions';
import { ConfigOption } from './types';

export const BPTimePrepare: ConfigOption = {
    desc: 'BP選角流程預備時間秒數',
    handler(ctx, value) {
        if (!value) {
            setConfigValue('BPTimePrepare', undefined);
            return commandSuccessResp('BP選角流程預備時間：立即開始');
        } else if (isNaN(+value)) {
            throw '僅可輸入純數字';
        } else if (+value < 1 || +value > 1000) {
            throw '僅可接受 1 ~ 1000 的數值';
        } else {
            const second = +value;
            setConfigValue('BPTimePrepare', second);
            return commandSuccessResp(`BP選角流程預備時間： ${second} 秒`);
        }
    },
};
