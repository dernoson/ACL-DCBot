import { BaseGuildTextChannel, GuildMember, Role } from 'discord.js';
import { botEnv, getAdminMention } from '../config/botSettings';
import { createTimeoutHandler, TimeoutHandler, normalMentionOptions } from '../utils';
import { MatchMode, StageHeader, StageSetting } from './types';
import { CommandResult } from '../commandUtils';

export class Match {
    readonly channel: BaseGuildTextChannel;
    readonly teams: Readonly<[Role, Role]>;
    readonly matchMode: MatchMode;
    readonly stageResult: StageHeader[] = [];
    state = MatchState.prepare;
    timeoutHandler?: TimeoutHandler;

    constructor(channel: BaseGuildTextChannel, teams: [Role, Role], matchMode: MatchMode) {
        this.channel = channel;
        this.teams = teams;
        this.matchMode = matchMode;
    }

    send(content: string) {
        return this.channel.send({ content, allowedMentions: normalMentionOptions });
    }

    getNowTeam() {
        return this.teams[+(this.stageResult.length % 2 != 0)];
    }

    setPause() {
        if (this.state != MatchState.running && this.state != MatchState.complete) return;
        this.state = MatchState.pause;
        this.timeoutHandler?.cancel();
    }

    setStart(flow: StageHeader[]) {
        if (this.stageResult.length >= flow.length && this.state != MatchState.confirm) this.state = MatchState.complete;
        if (this.state != MatchState.pause && this.state != MatchState.prepare) return;
        this.state = MatchState.running;
        const BPTimeLimit = botEnv.get('BPTimeLimit');
        if (typeof BPTimeLimit != 'number') return '不限時間。';

        const teamName = this.getNowTeam().name;
        this.timeoutHandler = createTimeoutHandler(BPTimeLimit * 1000, () => {
            this.setPause();
            this.send(`選擇角色超時，已暫停流程，請 ${getAdminMention()} 進行處理中`);
            botEnv.log(`> ${teamName} 於 ${this.channel.name} 選角超時。`);
        });
        return `限時 ${BPTimeLimit} 秒。`;
    }
}

export const enum MatchState {
    prepare,
    running,
    pause,
    complete,
    confirm,
}

export type ModeSetting = {
    desc: string;
    flow: StageSetting[];
    logTotal: (match: Match) => string;
    onStart: (match: Match) => string;
    onRemove: (match: Match) => string;
    onSelect: (match: Match, operatorList: string[], member: GuildMember) => CommandResult;
};
