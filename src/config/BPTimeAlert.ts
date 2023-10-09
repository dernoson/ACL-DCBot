import { commandSuccessResp } from '../functions';
import { getConfigValue, setConfigValue } from './functions';
import { ConfigOption } from './types';

export const BPTimeAlert: ConfigOption = {
    desc: 'BP選角時限提醒秒數',
    handler(ctx, value) {
        if (!value) {
            setConfigValue('BPTimeAlert', undefined);
            return commandSuccessResp('BP選角時限提醒：關閉');
        } else if (isNaN(+value)) {
            throw '僅可輸入純數字';
        }

        const BPTimeLimit = getConfigValue('BPTimeLimit');

        if (BPTimeLimit == undefined) {
            throw '未設定BP選角時限秒數，該設定無效';
        } else if (+value < 10 || +value > BPTimeLimit) {
            throw `僅可接受 10 ~ ${BPTimeLimit} (BP選角時限秒數) 的數值`;
        } else {
            const second = +value;
            setConfigValue('BPTimeAlert', second);
            return commandSuccessResp(`BP選角時限提醒： ${second} 秒前提醒`);
        }
    },
};
