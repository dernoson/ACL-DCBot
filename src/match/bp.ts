import { GuildMember, Role, roleMention } from 'discord.js';
import { createLogString } from '../utils';
import { I_MatchHandlers, I_MatchStorage, MatchState, StepHeader } from './types';
import { checkMatchStepChange, removeStep } from './functions';
import { setMatchTimeout } from './matchStorage';
import { normalMentionOptions } from '../consts';
import { getAdminMention, getConfigValue, log } from '../config';

export const createBPHandlers = (handlersDesc: string, flow: BPStepSetting[]): I_MatchHandlers<BPStepStorage> => {
    const [total] = getBPFlowTotal(flow);
    const desc = `${handlersDesc} ( 單方 ban: ${total.ban}, pick: ${total.pick} )`;

    return {
        desc,
        flow,
        onStart: (storage) => onStart(flow, storage),
        onSelect(storage, operators, member) {
            const stepSetting = flow[storage.stepStorage.length];

            return createLogString(
                setBPSelect(stepSetting, storage, member, operators), //
                onStart(flow, storage) || undefined
            );
        },
        onRemove(storage) {
            const removedStep = removeStep(storage);
            const content = setBPRemove(removedStep, storage);
            return { content, log: content };
        },
        logTotal: (storage) => logTotal(flow, storage),
    };
};

const onStart = (flow: BPStepSetting[], storage: I_MatchStorage) => {
    if (checkMatchStepChange(flow, storage)) {
        return createLogString(
            logTotal(flow, storage) || undefined, //
            `流程已結束，請 ${getAdminMention()} 進行最後確認。`
        );
    }

    const { stepStorage, teams } = storage;
    const flowIndex = stepStorage.length;
    const stepSetting = flow[flowIndex];
    const nowTeam = teams[stepSetting.teamIndex];

    return createLogString(
        logTotal(flow, storage) || undefined, //
        setBPStart(stepSetting, storage, nowTeam)
    );
};

const logTotal = (flow: BPStepSetting[], storage: I_MatchStorage) => {
    const total = getBPFlowTotal(flow);
    const BPList = getBPList(storage);

    const getTeamBPDesc = (idx: 0 | 1) => {
        const { ban: banLimit, pick: pickLimit } = total[idx];
        const { ban, pick } = BPList[idx];

        return createLogString(
            ban.length
                ? createLogString(
                      `=== ban (${ban.length}/${banLimit}) ===`, //
                      ban.join(' ')
                  )
                : undefined,
            ban.length && pick.length ? '' : undefined,
            pick.length
                ? createLogString(
                      `=== pick (${pick.length}/${pickLimit}) ===`, //
                      pick.join(' ')
                  )
                : undefined
        );
    };

    const team_0_Desc = getTeamBPDesc(0);
    const team_1_Desc = getTeamBPDesc(1);

    return createLogString(
        !team_0_Desc ? undefined : `${storage.teams[0].name}\`\`\`${team_0_Desc}\`\`\``,
        !team_1_Desc ? undefined : `${storage.teams[1].name}\`\`\`${team_1_Desc}\`\`\``
    );
};

export const setBPStart = (stepSetting: BPStepSetting, storage: I_MatchStorage, nowTeam: Role) => {
    const { channel } = storage;
    const BPTimeLimit = getConfigValue('BPTimeLimit') ?? 0;
    const BPTimeAlert = getConfigValue('BPTimeAlert') ?? 0;

    BPTimeLimit &&
        setMatchTimeout(channel, 'selectTimeout', BPTimeLimit * 1000, () => {
            storage.state = MatchState.pause;
            channel.send({
                content: `${roleMention(nowTeam.id)} 選擇角色超時，流程暫停，請 ${getAdminMention()} 處理。`,
                allowedMentions: normalMentionOptions,
            });
            log(`> ${nowTeam.name} 於 ${channel.name} 選擇角色超時。`);
        });
    BPTimeAlert &&
        setMatchTimeout(channel, 'selectAlert', (BPTimeLimit - BPTimeAlert) * 1000, () => {
            channel.send(`${roleMention(nowTeam.id)} 尚餘 ${BPTimeAlert} 秒`);
        });

    return createLogString(
        `【 ${stepSetting.option.toUpperCase()} 】請 ${roleMention(nowTeam.id)} 選擇 ${stepSetting.amount} 位幹員。`,
        BPTimeLimit ? `限時 ${BPTimeLimit} 秒。` : undefined
    );
};

export const setBPSelect = (stepSetting: BPStepSetting, storage: I_MatchStorage, member: GuildMember, operators: string[]) => {
    const nowTeam = storage.teams[stepSetting.teamIndex];
    if (member.roles.cache.every((role) => role.id != nowTeam.id)) {
        throw '當前頻道內你並無使用/select指令的權限';
    }
    if (operators.length != stepSetting.amount) {
        throw `選擇幹員數量應為 ${stepSetting.amount} 位，你選擇了 ${operators.length} 位，請重新選擇`;
    }

    const BPList = getBPList(storage);
    const selected = new Set(BPList.map(({ ban, pick }) => [...ban, ...pick]).flat());
    if (operators.some((operator) => selected.has(operator))) {
        throw '部分選擇的幹員已被選擇過，請重新選擇';
    }

    (storage as I_MatchStorage<BPStepStorage>).stepStorage.push({ ...stepSetting, operators });

    return `${nowTeam.name} 選擇了 \`${operators.join(' ')}\``;
};

export const setBPRemove = (removedStage: BPStepStorage, storage: I_MatchStorage) => {
    const targetTeam = storage.teams[removedStage.teamIndex];
    return `已移除 ${targetTeam.name} ${removedStage.option} 的 \`${removedStage.operators.join(' ')}\``;
};

export const isBPStepStorage = (flowHeader: any): flowHeader is BPStepStorage => {
    if (flowHeader.option != 'ban' && flowHeader.option != 'pick') return false;
    if (!Array.isArray(flowHeader.operators)) return false;
    if (typeof flowHeader.teamIndex != 'number') return false;
    return true;
};

const getBPFlowTotal = (flow: BPStepSetting[]) => {
    const result: [Record<BPOption, number>, Record<BPOption, number>] = [
        { ban: 0, pick: 0 },
        { ban: 0, pick: 0 },
    ];

    flow.forEach(({ option, amount, teamIndex }) => (result[teamIndex][option] += amount));

    return result;
};

const getBPList = (storage: I_MatchStorage) => {
    const bpList: [Record<BPOption, string[]>, Record<BPOption, string[]>] = [
        { ban: [], pick: [] },
        { ban: [], pick: [] },
    ];

    storage.stepStorage.forEach((flowHeader) => {
        if (!isBPStepStorage(flowHeader)) return;
        bpList[flowHeader.teamIndex][flowHeader.option].push(...flowHeader.operators);
    });

    return bpList;
};

export type BPStepStorage = StepHeader<BPOption> & {
    operators: string[];
    teamIndex: 0 | 1;
};

export type BPStepSetting = StepHeader<BPOption> & {
    amount: number;
    teamIndex: 0 | 1;
};

export type BPOption = 'ban' | 'pick';
