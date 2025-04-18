import { MessageResponser } from './types';
import { getRandomInt } from '../utils';

export const nhmmm: MessageResponser = {
    desc: '貓草69',
    handler(message) {
        if (message.content.includes('貓草69')) {
            const randStr = responseStr[getRandomInt(responseStr.length)];
            return randStr;
        }
    },
};

const responseStr = [
    '你好貓毛貓 黑夜裡閃耀',
    '集批貓毛貓 電腦前苦惱',
    '貓贏六九 携著隊友走',
    '貓托六九 嗅到出軌的味道',
    '閉嘴winsok 天天不理我',
    '閉嘴托比 天天不寵我',
    '那我問你們 為何不找我組隊',
    '你們反問我 不是已經找過嗎',
    '一語道破 心裏根本沒有我',
    '托比winsok 無需再選擇',
    '貓贏六九 已成過去',
    '貓托六九 已成歷史',
    '如今只有阿草 才是我最新的隊友',
    '請叫我們 貓草六九',
    '你好貓毛貓 抓牌啥都要',
    '集批貓毛貓 被隊友檢討',
    '貓草六九 塑造新主流',
    '貓草六九 才是最後的選擇'
];
