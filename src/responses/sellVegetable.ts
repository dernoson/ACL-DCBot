import { MessageResponser } from './types';
import { getRandomInt } from '../utils';

export const sellVegetable: MessageResponser = {
    desc: '治賣菜專用(關鍵字：菜/寄/佬/禿)',
    handler(message) {
        for (const keyword of Object.keys(strMap)) {
            if (message.content.includes(keyword)) {
                const strs = strMap[keyword];
                return strs[getRandomInt(strs.length)];
            }
        }
    },
};

const strMap: Record<string, string[]> = {
    菜: [
        '連我這機器人都知道你在賣菜', //
        '你媽知道你每天上DC賣菜嗎？',
    ],
    寄: [
        '寄什麼寄，恐懼源自於課金不足', //
        '千招百式再一寄！！',
    ],
    佬: [
        '你才佬，你全家都佬', //
        '我不是針對你，我是說在座各位，全都是佬',
    ],
    禿: [
        '機器人這邊有賣生髮水，一瓶目前行情方舟一單，要買就快斗內給德諾索', //
        '滿地頭髮都是你的',
    ],
};
