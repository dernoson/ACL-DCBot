import { MessageResponser } from './types';
import { getRandomInt } from '../utils';

export const chongyue: MessageResponser = {
    desc: '很吵的龍(隨機回覆，20%機率)',
    handler() {
        const randNum = Math.random();
        if (randNum > 0.2) return;
        return randStr();
    },
};

const randStr = (idx = 0): string => {
    if (idx > 4) return '';
    const randNum = idx ? getRandomInt(responseStr.length * 1.5) : getRandomInt(responseStr.length);
    const res = responseStr[randNum];
    return res ? res + randStr(idx + 1) : '';
};

const responseStr = ['形不成形', '你們解決問題', '千招百式', '勁發江潮落'];
