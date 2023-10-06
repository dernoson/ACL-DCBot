import { BaseGuildTextChannel, ChannelType, Role } from 'discord.js';
import { botEnv } from '../BotEnv';
import { Match, defaultMatchMode, matchMap, MatchMode, matchModeMap } from '../match';
import { checkAdminPermission, checkSendMessagePermission, commandSuccessResp } from '../utils';
import { clearMatchContent } from './MatchClear';
import { createCommand } from '../commandUtils';

export default createCommand('match_set', '[ 主辦方指令 ] 設定比賽分組，並指定BP專用頻道')
    .option_Channel('channel', 'BP使用頻道', true, [ChannelType.GuildText])
    .option_Role('team1', '先手隊伍身分組', true)
    .option_Role('team2', '後手隊伍身分組', true)
    .option_Boolean('force', '選填該選項為True時，強制覆蓋該頻道原有BP指定')
    .callback((ctx, { channel, team1, team2, force }) => {
        checkAdminPermission(ctx);

        if (!(channel instanceof BaseGuildTextChannel)) throw '指定頻道非伺服器中的純文字頻道';
        if (!ctx.guild || !checkSendMessagePermission(ctx.guild, channel)) throw '機器人在伺服器或指定頻道中並無發送訊息權限，請確認伺服器設定';
        if (!(team1 instanceof Role) || !(team2 instanceof Role)) throw '指定身分組不符需求';
        const oldMatch = matchMap.get(channel.id);
        if (!force && oldMatch)
            throw '該頻道尚留存比賽分組指定，可使用match_clear指令先清除該頻道舊有指定，或是在該指令附加 { force: true } 選項';

        if (oldMatch) clearMatchContent(oldMatch);

        const matchMode = (botEnv.get('MatchFlow') as MatchMode) || defaultMatchMode;
        matchMap.set(channel.id, new Match(channel, [team1, team2], matchMode));
        const matchModeDesc = matchModeMap[matchMode].desc;
        return commandSuccessResp(`指定比賽分組：${team1.name} vs ${team2.name} ， 指定BP頻道：${channel.name}\n${matchModeDesc}`);
    });
