import { BaseGuildTextChannel, GuildMember, Role } from 'discord.js';
import { botEnv, getAdminMention } from '../BotEnv';
import { createTimeoutHandler, TimeoutHandler, normalMentionOptions } from '../utils';
import { StageHeader, StageSetting } from './types';
import { CommandResult } from '../commandUtils';

export class Match {
    readonly stageResult: StageHeader[] = [];
    state = MatchState.prepare;
    prepareTimeoutHandler?: TimeoutHandler;
    timeoutHandler?: TimeoutHandler;
    private alertTimeoutHandler?: TimeoutHandler;

    constructor(readonly channel: BaseGuildTextChannel, readonly teams: [Role, Role], readonly matchMode: string) {}

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
        if (this.stageResult.length >= flow.length) this.state = MatchState.complete;

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

        const BPTimeAlert = botEnv.get('BPTimeAlert');
        const timeLimitDiff = BPTimeLimit - 30;
        if (BPTimeAlert && timeLimitDiff > 60) {
            this.alertTimeoutHandler = createTimeoutHandler(timeLimitDiff * 1000, () => {
                this.send(`尚餘30秒`);
            });
        }

        return `限時 ${BPTimeLimit} 秒。`;
    }

    cancelTimeout() {
        this.timeoutHandler?.cancel();
        this.alertTimeoutHandler?.cancel();
        this.prepareTimeoutHandler?.cancel();
    }
}

export const enum MatchState {
    prepare,
    running,
    pause,
    complete,
}

export type ModeSetting = {
    desc: string;
    flow: StageSetting[];
    logTotal: (match: Match) => string;
    onStart: (match: Match) => string;
    onRemove: (match: Match) => string;
    onSelect: (match: Match, operatorList: string[], member: GuildMember) => CommandResult;
};
