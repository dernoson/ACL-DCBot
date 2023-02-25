import { botEnv, dumpSetting } from '../../config/botSettings';
import { defaultMatchFlowKey, matchFlowMap, matchFlowMapKeysArr } from '../../match';
import { ConfigOption } from './types';

export const BPTimeLimit: ConfigOption = {
    desc: 'BP選角時限秒數',
    async handler(replier, value) {
        if (!value) {
            botEnv.set('MatchFlow', undefined);
            dumpSetting();
            await replier.success(`[設定機器人環境] BP流程設置：${matchFlowMap[defaultMatchFlowKey].desc}`);
        } else if (matchFlowMapKeysArr.includes(value as any)) {
            botEnv.set('MatchFlow', value);
            dumpSetting();
            await replier.success(`[設定機器人環境] BP流程設置：${matchFlowMap[value].desc}`);
        } else {
            const settingDesc = matchFlowMapKeysArr.map((key) => `\`${key}\` : ${matchFlowMap[key].desc}`).join('\n');
            await replier.fail(`MatchFlow僅可接受以下字串值：\n${settingDesc}`);
        }
    },
};
