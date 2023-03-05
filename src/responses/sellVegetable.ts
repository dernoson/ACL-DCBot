import { MessageResponser } from './types';

export const sellVegetable: MessageResponser = {
    desc: '治賣菜專用(關鍵字：菜/寄/佬/禿)',
    handler(message) {
        const randNum = Math.random();
        if (message.content.includes('菜')) return randNum > 0.5 ? '連我這機器人都知道你在賣菜' : '你媽知道你每天上DC賣菜嗎？';
        if (message.content.includes('寄')) return randNum > 0.5 ? '寄什麼寄，恐懼源自於課金不足' : '千招百式再一寄！！';
        if (message.content.includes('佬')) return '你才佬，你全家都佬';
        if (message.content.includes('禿')) return '機器人這邊有賣生髮水，一瓶目前行情方舟一單，要買就快斗內給德諾索';
    },
};
