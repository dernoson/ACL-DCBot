import { GuildMember, Role, TextChannel } from 'discord.js';
import { botEnv, getAdminMention } from '../config/botSettings';
import { normalMentionOptions } from '../config/optionSettings';
import { createTimeoutHandler, TimeoutHandler } from '../utils';
import { FlowSettingKey, getFlowContent } from './flowSettings';
import { StageHeader, StageSetting } from './types';

export type Match = {
    channel: TextChannel;
    teams: [Role, Role];
    flowSettingKey: FlowSettingKey;
    stageIndex: number;
    stageResult: StageHeader[];
    state: MatchState;
    timeoutHandler?: TimeoutHandler;
};

export const createMatch = (channel: TextChannel, teams: [Role, Role], flowSettingKey: FlowSettingKey): Match => ({
    channel,
    teams,
    flowSettingKey,
    stageIndex: 0,
    stageResult: [],
    state: MatchState.prepare,
});

export const sendMatchChannel = (match: Match, content: string) => {
    match.channel.send({ content, allowedMentions: normalMentionOptions });
};

export const createMatchTimeout = (match: Match, timeout: number) => {
    match.timeoutHandler?.cancel();
    const teamName = getNowTeam(match).name;
    match.timeoutHandler = createTimeoutHandler(timeout * 1000, () => {
        match.state = MatchState.pause;
        sendMatchChannel(match, `選擇角色超時，已暫停BP流程，請 ${getAdminMention()} 進行處理中`);
        botEnv.log(`> ${teamName} 於 ${match.channel.name} 選角超時。`);
    });
};

export const getNowTeam = (match: Match) => match.teams[+(match.stageIndex % 2 != 0)];

export const getNowStageSetting = <T extends StageSetting>(match: Match) => (getFlowContent(match.flowSettingKey) as T[]).at(match.stageIndex);

export const enum MatchState {
    prepare = '準備中',
    running = '進行中',
    pause = '暫停',
    complete = '待確認',
    fixed = '已確認',
}

export type StageHandler<O extends string = string> = {
    onStart: (stage: StageSetting<O>, match: Match) => string;
    onSelect: (stage: StageSetting<O>, operatorList: string[], match: Match, member: GuildMember) => string;
    onRemove: (match: Match) => string;
};
