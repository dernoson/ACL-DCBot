import { ChannelType, TextChannel } from 'discord.js';
import {
    MatchState,
    matchModeMap,
    getAllMatchStorage,
    getMatchStorage,
    I_MatchStorage,
    I_MatchHandlers,
    createOpeningLog,
    setMatchTimeout,
} from '../match';
import { createLogString } from '../utils';
import { createCommand } from '../commandUtils';
import { assertAdminPermission } from '../BotEnv';
import { commandSuccessResp } from '../functions';
import { normalMentionOptions } from '../mentionOption';

export default createCommand('match_start', '[ 主辦方指令 ] 開始BP選角流程')
    .option_Channel('channel', '選擇欲啟動的BP使用頻道，未填選時，視為選擇使用該指令的當前頻道', false, [ChannelType.GuildText])
    .option_Boolean('all', '選填該選項為True時，無視channel指定，將所有狀態為未開始、暫停中的BP頻道設為開始狀態')
    .option_Boolean('force', '選填該選項為True時，所有指定的頻道都會強制開始流程，不會等待')
    .callback((ctx, { channel, all, force }) => {
        assertAdminPermission(ctx);
        if (all) {
            const startedMatchName: string[] = [];
            for (const storage of getAllMatchStorage()) {
                try {
                    setMatchStart(storage, force);
                    startedMatchName.push(storage.channel.name);
                } catch (error) {
                    console.log(storage.channel.name, error);
                }
            }
            const result = startedMatchName.length ? `已啟動以下頻道的BP流程：\n${startedMatchName.join('\n')}` : '未啟動任何頻道的BP流程';
            return commandSuccessResp(result);
        } else {
            const targetChannel = channel || ctx.channel;
            if (!(targetChannel instanceof TextChannel)) throw '指定頻道非純文字頻道';
            const storage = getMatchStorage(targetChannel);
            if (!storage) throw '指定頻道非BP使用頻道';

            setMatchStart(storage, force);
            return commandSuccessResp(`已啟動 ${targetChannel.name} 的BP流程`);
        }
    });

const setMatchStart = (storage: I_MatchStorage, force?: boolean) => {
    const lastState = storage.state;
    if (lastState != MatchState.pause) throw '該頻道BP流程無法啟動';

    const matchHandlers = matchModeMap[storage.matchMode] as I_MatchHandlers;

    const getStartContent = () => {
        const content = matchHandlers.onStart(storage);
        return typeof content == 'string' ? content : content.content ?? '';
    };

    if (!force && !storage.stepStorage.length) {
        storage.channel.send(
            createLogString(
                createOpeningLog(matchHandlers.desc, storage), //
                '選角流程將於 3 分鐘後開始，請主辦方與參賽方做好準備。'
            )
        );
        setMatchTimeout(storage.channel, 'prepare', 180 * 1000, () => {
            storage.state = MatchState.running;
            storage.channel.send({ content: getStartContent(), allowedMentions: normalMentionOptions });
        });
    } else if (!storage.stepStorage.length) {
        storage.state = MatchState.running;
        storage.channel.send({
            content: createLogString(
                createOpeningLog(matchHandlers.desc, storage), //
                getStartContent()
            ),
            allowedMentions: normalMentionOptions,
        });
    } else {
        storage.state = MatchState.running;
        storage.channel.send({ content: getStartContent(), allowedMentions: normalMentionOptions });
    }
};
