import { botEnv, dumpSetting } from '../../BotEnv';
import { commandSuccessResp } from '../../functions';
import { ConfigOption } from './types';

export const BPTimeAlert: ConfigOption = {
    desc: 'BP選角時限提醒秒數',
    handler(ctx, value) {
        if (!value) {
            botEnv.set('BPTimeAlert', undefined);
            dumpSetting();
            return commandSuccessResp('BP選角時限提醒：關閉');
        } else if (isNaN(+value)) {
            throw '僅可輸入純數字';
        }

        const BPTimeLimit = botEnv.get('BPTimeLimit');

        if (typeof BPTimeLimit != 'number') {
            throw '未設定BP選角時限秒數，該設定無效';
        } else if (+value < 10 || +value > BPTimeLimit) {
            throw `僅可接受 10 ~ ${BPTimeLimit} (BP選角時限秒數) 的數值`;
        } else {
            const second = +value;
            botEnv.set('BPTimeAlert', second);
            dumpSetting();
            return commandSuccessResp(`BP選角時限提醒： ${second} 秒前提醒`);
        }
    },
};
