import { GuildMember, Role, TextChannel } from 'discord.js';
import { botEnv, getAdminMention } from '../config/botSettings';
import { normalMentionOptions } from '../config/optionSettings';
import { CommandResult } from '../types';
import { createTimeoutHandler, TimeoutHandler } from '../utils';
import { MatchMode, StageHeader, StageSetting } from './types';

export class Match {
    readonly channel: TextChannel;
    readonly teams: Readonly<[Role, Role]>;
    readonly matchMode: MatchMode;
    readonly stageResult: StageHeader[] = [];
    state = MatchState.prepare;
    timeoutHandler?: TimeoutHandler;

    constructor(channel: TextChannel, teams: [Role, Role], matchMode: MatchMode) {
        this.channel = channel;
        this.teams = teams;
        this.matchMode = matchMode;
    }

    send = (content: string) => this.channel.send({ content, allowedMentions: normalMentionOptions });

    getNowTeam = () => this.teams[+(this.stageResult.length % 2 != 0)];

    setStageStart = () => {
        if (this.state == MatchState.complete || this.state == MatchState.confirm) return null;
        this.state = MatchState.running;

        const BPTimeLimit = botEnv.get('BPTimeLimit');
        if (typeof BPTimeLimit == 'number') {
            this.timeoutHandler?.cancel();
            const teamName = this.getNowTeam().name;
            this.timeoutHandler = createTimeoutHandler(BPTimeLimit * 1000, () => {
                this.state = MatchState.pause;
                this.send(`選擇角色超時，已暫停流程，請 ${getAdminMention()} 進行處理中`);
                botEnv.log(`> ${teamName} 於 ${this.channel.name} 選角超時。`);
            });
            return { timeLimit: BPTimeLimit };
        }
        return {};
    };
}

export const enum MatchState {
    prepare = '準備中',
    running = '進行中',
    pause = '暫停',
    complete = '待確認',
    confirm = '已確認',
}

export type ModeSetting = {
    desc: string;
    flow: StageSetting[];
    logTotal: (match: Match) => string;
    logStart: (match: Match) => string;
    onRemove: (match: Match) => string;
    onSelect: (match: Match, operatorList: string[], member: GuildMember) => CommandResult;
};
