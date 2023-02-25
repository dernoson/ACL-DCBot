import { botEnv, dumpSetting } from '../../config/botSettings';
import { ConfigOption } from './types';

export const MatchFlow: ConfigOption = {
    desc: 'BP使用流程',
    async handler(replier, value) {
        if (!value) {
            botEnv.set('BPTimeLimit', undefined);
            dumpSetting();
            await replier.success('[設定機器人環境] BP選角時限秒數：不限');
        } else if (isNaN(+value)) {
            await replier.fail('BPTimeLimit 僅可輸入純數字');
        } else if (+value < 1 || +value > 1000) {
            await replier.fail('BPTimeLimit 僅可接受 1~1000 的數值');
        } else {
            const second = +value;
            botEnv.set('BPTimeLimit', +second);
            dumpSetting();
            await replier.success(`[設定機器人環境] BP選角時限秒數： ${second} 秒`);
        }
    },
};
