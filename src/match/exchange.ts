import { GuildMember, roleMention } from 'discord.js';
import { createLogString } from '../utils';
import { BPOption, BPStepSetting, BPStepStorage, isBPStepStorage, setBPRemove, setBPSelect, setBPStart } from './bp';
import { checkMatchStepChange, removeStep } from './functions';
import { getMatchCache, removeMatchTimeout, setMatchCache, setMatchTimeout } from './matchStorage';
import { I_MatchHandlers, I_MatchStorage, MatchState, StepHeader } from './types';
import { normalMentionOptions } from '../consts';
import { getAdminMention, getConfigValue, log } from '../config';

export const createExchangeHandler = (handlersDesc: string, flow: EXStepSetting[]): I_MatchHandlers<EXStepStorage> => {
    const [total] = getEXFlowTotal(flow);
    const desc = `${handlersDesc} ( 單方 ban: ${total.ban}, pick: ${total.pick}, exchange: ${total.exchange} )`;

    return {
        desc,
        flow,
        onStart: (storage) => onStart(flow, storage),
        onSelect(storage, operators, member) {
            const { stepStorage, channel, teams } = storage;
            const stepSetting = flow[stepStorage.length];

            if (stepSetting.option != 'exchange') {
                return createLogString(
                    setBPSelect(stepSetting, storage, member, operators), //
                    onStart(flow, storage) || undefined
                );
            } else if (!checkEXSelect(stepSetting, storage, member, operators)) {
                return {
                    content: createLogString(
                        `你已選擇交換 \`${operators.join(' ')}\`，等待對方完成選擇。`, //
                        '你的選擇會在兩方都完成選擇後才會公布。'
                    ),
                    ephemeral: true,
                };
            } else {
                const step: EXStepStorage & StepHeader<'exchange'> = {
                    ...stepSetting,
                    exOps: getMatchCache(channel, 'exchange', () => [[], []] as ExchangeCache),
                };
                stepStorage.push(step);
                return createLogString(
                    `${teams[0].name} 的 \`${step.exOps[1].join(' ')}\` 與 ${teams[1].name} 的 \`${step.exOps[0].join(' ')}\` 交換`, //
                    onStart(flow, storage) || undefined
                );
            }
        },
        onRemove(storage) {
            const removedStep = removeStep(storage);
            const content = removedStep.option != 'exchange' ? setBPRemove(removedStep, storage) : setEXRemove(removedStep, storage);
            return { content, log: content };
        },
        logTotal: (storage) => logTotal(flow, storage),
    };
};

const onStart = (flow: EXStepSetting[], storage: I_MatchStorage) => {
    if (checkMatchStepChange(flow, storage)) {
        return createLogString(
            logTotal(flow, storage) || undefined, //
            `流程已結束，請 ${getAdminMention()} 進行最後確認。`
        );
    }
    const { stepStorage, teams } = storage;
    const flowIndex = stepStorage.length;
    const stepSetting = flow[flowIndex];

    return createLogString(
        logTotal(flow, storage) || undefined, //
        stepSetting.option != 'exchange' ? setBPStart(stepSetting, storage, teams[stepSetting.teamIndex]) : setEXStart(stepSetting, storage)
    );
};

const logTotal = (flow: EXStepSetting[], storage: I_MatchStorage) => {
    const total = getEXFlowTotal(flow);
    const EXList = getEXList(storage);

    EXList[0].pick = EXList[0].pick.filter((op) => !EXList[1].exchange.includes(op)).concat(EXList[0].exchange);
    EXList[1].pick = EXList[1].pick.filter((op) => !EXList[0].exchange.includes(op)).concat(EXList[1].exchange);

    const getTeamBPDesc = (idx: 0 | 1) => {
        const { ban: banLimit, pick: pickLimit } = total[idx];
        const { ban, pick } = EXList[idx];

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
                      `=== pick (${pick.length}/${pickLimit}) (已計算交換幹員) ===`, //
                      pick.join(' ')
                  )
                : undefined
        );
    };

    const team_0_Desc = getTeamBPDesc(0);
    const team_1_Desc = getTeamBPDesc(1);
    const exchangeAmount = Math.max(EXList[0].exchange.length, EXList[1].exchange.length);
    const { teams } = storage;

    return createLogString(
        !team_0_Desc ? undefined : `${teams[0].name}\`\`\`${team_0_Desc}\`\`\``,
        !team_1_Desc ? undefined : `${teams[1].name}\`\`\`${team_1_Desc}\`\`\``,
        !exchangeAmount
            ? undefined
            : createLogString(
                  `交換幹員 (${exchangeAmount}/${total[0].exchange})\`\`\``,
                  `《${teams[0].name}》${EXList[1].exchange.join(' ')}`,
                  '⇅',
                  `《${teams[1].name}》${EXList[0].exchange.join(' ')}`,
                  '```'
              )
    );
};

export const setEXStart = (stepSetting: EXStepSetting & StepHeader<'exchange'>, storage: I_MatchStorage) => {
    const { channel, teams } = storage;
    const BPTimeLimit = getConfigValue('BPTimeLimit') ?? 0;
    const BPTimeAlert = getConfigValue('BPTimeAlert') ?? 0;

    teams.forEach((team) => {
        BPTimeLimit &&
            setMatchTimeout(channel, `selectTimeout#${team.id}`, BPTimeLimit * 1000, () => {
                storage.state = MatchState.pause;
                channel.send({
                    content: `${roleMention(team.id)} 選擇角色超時，流程暫停，請 ${getAdminMention()} 處理。`,
                    allowedMentions: normalMentionOptions,
                });
                log(`> ${team.name} 於 ${channel.name} 選擇角色超時。`);
            });
        BPTimeAlert &&
            setMatchTimeout(channel, `selectAlert#${team.id}`, (BPTimeLimit - BPTimeAlert) * 1000, () => {
                channel.send(`${roleMention(team.id)} 尚餘 ${BPTimeAlert} 秒`);
            });
    });

    return createLogString(
        `請 ${roleMention(teams[0].id)} 、 ${roleMention(teams[1].id)} 各自選擇要交換的 ${stepSetting.amount} 位幹員`,
        '該階段會在兩方都選擇完畢後，才會公布選擇內容。'
    );
};

export const checkEXSelect = (
    stepSetting: EXStepSetting & StepHeader<'exchange'>,
    storage: I_MatchStorage,
    member: GuildMember,
    operators: string[]
) => {
    const { channel, teams } = storage;
    const cache = getMatchCache(channel, 'exchange', () => [[], []] as ExchangeCache);

    const targetTeamIdx = teams.findIndex((team) => member.roles.cache.has(team.id)) as -1 | 0 | 1;
    if (targetTeamIdx == -1) {
        throw '當前頻道內你並無使用/select指令的權限';
    }
    if (cache[targetTeamIdx].length) {
        throw '你已選擇過交換的幹員，請靜候對方的選取';
    }
    if (operators.length != stepSetting.amount) {
        throw `選擇幹員數量應為 ${stepSetting.amount} 位，你選擇了 ${operators.length} 位，請重新選擇`;
    }

    const EXList = getEXList(storage);
    const opponentIndex = targetTeamIdx ? 0 : 1;
    const opponentPick = EXList[opponentIndex].pick;
    if (!operators.every((op) => opponentPick.includes(op))) {
        throw '部分選擇的幹員沒有在對方的pick列表，請重新選擇';
    }

    cache[targetTeamIdx] = operators;
    setMatchCache(channel, 'exchange', cache);
    removeMatchTimeout(channel, `selectTimeout#${teams[targetTeamIdx].id}`);
    removeMatchTimeout(channel, `selectAlert#${teams[targetTeamIdx].id}`);

    return !!cache[0].length && !!cache[1].length;
};

export const setEXRemove = (removedStep: EXStepStorage & StepHeader<'exchange'>, storage: I_MatchStorage) => {
    const { exOps } = removedStep;
    const { teams } = storage;
    return createLogString(
        '已移除交換幹員：', //
        `《${teams[0].name}》${exOps[1].join(' ')}`,
        '⇅',
        `《${teams[1].name}》${exOps[0].join(' ')}`
    );
};

const getEXFlowTotal = (flow: EXStepSetting[]) => {
    const result: [Record<EXOption, number>, Record<EXOption, number>] = [
        { ban: 0, pick: 0, exchange: 0 },
        { ban: 0, pick: 0, exchange: 0 },
    ];

    flow.forEach((step) => {
        if (step.option == 'exchange') {
            result[0].exchange += step.amount;
            result[1].exchange += step.amount;
        } else {
            result[step.teamIndex][step.option] += step.amount;
        }
    });

    return result;
};

const getEXList = (storage: I_MatchStorage) => {
    const exList: [Record<EXOption, string[]>, Record<EXOption, string[]>] = [
        { ban: [], pick: [], exchange: [] },
        { ban: [], pick: [], exchange: [] },
    ];

    storage.stepStorage.forEach((flowHeader) => {
        if (!isEXStepStorage(flowHeader)) return;
        if (flowHeader.option == 'exchange') {
            exList[0].exchange.push(...flowHeader.exOps[0]);
            exList[1].exchange.push(...flowHeader.exOps[1]);
        } else {
            exList[flowHeader.teamIndex][flowHeader.option].push(...flowHeader.operators);
        }
    });

    return exList;
};

export const isEXStepStorage = (flowHeader: any): flowHeader is EXStepStorage => {
    if (isBPStepStorage(flowHeader)) return true;
    if (flowHeader.option != 'exchange') return false;
    if (!Array.isArray(flowHeader.exOps)) return false;
    return true;
};

export type EXStepStorage =
    | BPStepStorage
    | (StepHeader<'exchange'> & {
          exOps: [string[], string[]];
      });

export type EXStepSetting =
    | BPStepSetting
    | (StepHeader<'exchange'> & {
          amount: number;
      });

export type ExchangeCache = [string[], string[]];

export type EXOption = BPOption | 'exchange';
