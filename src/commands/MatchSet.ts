import { BaseGuildTextChannel, Role } from 'discord.js';
import { defaultMatchMode, getMatchStorage, createMatchStorage, matchModeDesc, setMatchTimeout, getMatchHandlers } from '../match';
import { createCommand } from '../commandUtils';
import { assertAdminPermission, getConfigValue } from '../config';
import { roleMention } from 'discord.js';
import { createLogString } from '../utils';
import { normalMentionOptions } from '../consts';

export default createCommand('match_set', '[ 主辦方指令 ] 創建並啟動該頻道的BP流程')
    .option_Role('team1', '先手隊伍身分組', true)
    .option_Role('team2', '後手隊伍身分組', true)
    .callback((ctx, { team1, team2 }) => {
        assertAdminPermission(ctx);

        const { channel } = ctx;
        if (!(channel instanceof BaseGuildTextChannel)) {
            throw '指定頻道非伺服器中的純文字頻道';
        }
        if (!(team1 instanceof Role) || !(team2 instanceof Role)) {
            throw '指定身分組不符需求';
        }
        if (getMatchStorage(channel)) {
            throw '該頻道尚留存BP流程，若要覆蓋流程設定，請先使用/match_clear';
        }

        const matchMode = getConfigValue('MatchFlow') ?? defaultMatchMode;
        const storage = createMatchStorage(channel, [team1, team2], matchMode);
        const desc = matchModeDesc[matchMode];
        const BPTimePrepare = getConfigValue('BPTimePrepare') ?? 0;

        const startMatch = (): string => {
            const matchHandlers = getMatchHandlers(matchMode);
            const content = matchHandlers.onStart(storage);
            return typeof content == 'string' ? content : content.content ?? '';
        };

        BPTimePrepare &&
            setMatchTimeout(channel, 'prepare', BPTimePrepare * 1000, () => {
                channel.send({ content: startMatch(), allowedMentions: normalMentionOptions });
            });

        return {
            content: createLogString(
                `**===  ${roleMention(team1.id)} vs ${roleMention(team2.id)} ===**`,
                `此次使用的選角流程為 \`${desc}\``,
                `途中遇到問題，都可以tag主辦方或管理員進行處理。`,
                BPTimePrepare ? `流程將於 ${BPTimePrepare} 秒後開始，請雙方與主辦方做好準備。` : startMatch()
            ),
            log: createLogString(
                `BP頻道：${channel.name}`, //
                `指定比賽分組：${team1.name} vs ${team2.name}`,
                `選角流程：${desc}`
            ),
        };
    });
