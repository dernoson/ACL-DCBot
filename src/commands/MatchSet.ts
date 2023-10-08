import { BaseGuildTextChannel, ChannelType, Role } from 'discord.js';
import { assertAdminPermission, botEnv } from '../BotEnv';
import { defaultMatchMode, MatchMode, matchModeMap, getMatchStorage, removeMatchStorage, createMatchStorage, dumpMatchStorage } from '../match';
import { createCommand } from '../commandUtils';
import { hasSendMessagePermission, commandSuccessResp } from '../functions';

export default createCommand('match_set', '[ 主辦方指令 ] 設定比賽分組，並指定BP專用頻道')
    .option_Channel('channel', 'BP使用頻道', true, [ChannelType.GuildText])
    .option_Role('team1', '先手隊伍身分組', true)
    .option_Role('team2', '後手隊伍身分組', true)
    .option_Boolean('force', '選填該選項為True時，強制覆蓋該頻道原有BP指定')
    .callback((ctx, { channel, team1, team2, force }) => {
        assertAdminPermission(ctx);

        if (!(channel instanceof BaseGuildTextChannel)) throw '指定頻道非伺服器中的純文字頻道';
        if (!ctx.guild || !hasSendMessagePermission(ctx.guild, channel)) throw '機器人在伺服器或指定頻道中並無發送訊息權限，請確認伺服器設定';
        if (!(team1 instanceof Role) || !(team2 instanceof Role)) throw '指定身分組不符需求';

        const storage = getMatchStorage(channel);
        if (!force && storage) {
            throw '該頻道尚留存比賽分組指定，可使用match_clear指令先清除該頻道舊有指定，或是在該指令附加 { force: true } 選項';
        } else {
            removeMatchStorage(channel);
        }

        const matchMode = (botEnv.get('MatchFlow') as MatchMode) || defaultMatchMode;
        createMatchStorage(channel, [team1, team2], matchMode);
        const matchModeDesc = matchModeMap[matchMode].desc;
        dumpMatchStorage();
        return commandSuccessResp(`指定比賽分組：${team1.name} vs ${team2.name} ， 指定BP頻道：${channel.name}\n${matchModeDesc}`);
    });
