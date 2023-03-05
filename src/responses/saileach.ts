import { MessageResponser } from './types';
import { getRandomInt } from './utils';

export const saileach: MessageResponser = {
    desc: '琴柳感(隨機回覆，20%機率)',
    handler() {
        const randNum = Math.random();
        if (randNum > 0.2) return;
        return randStr();
    },
};

const randStr = () => {
    const rand1 = getRandomInt(head.length);
    const rand2 = getRandomInt(middle.length);
    const rand3 = getRandomInt(tail.length);

    return head[rand1] + middle[rand2] + tail[rand3];
};

const head = ['你有沒有聽見', '你有沒有感受到', '你不曾注意', '你是否想過'];

const middle = ['孩子們的', '城市在', '陰謀得逞者在'];

const tail = ['悲鳴', '獰笑', '分崩離析'];
