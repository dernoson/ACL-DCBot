import { MessageResponser } from './types';
import { getRandomInt } from './utils';

export const grapeFruitify: MessageResponser = {
    desc: 'YT實況主的神軸提供(不一定回應，關鍵字：軸)',
    handler(message) {
        const randNum = getRandomInt(responseStr.length * 2);
        if (!message.content.includes('軸')) return;
        return responseStr[randNum];
    },
};

const responseStr = [
    '你知道遠牙開技能會無視物防嗎？',
    '我覺得因為早露比不上號角，所以不要練早露。',
    'W的閃避機率高達40%！！！',
    '黑的出場率很爛，像我淵默都不放黑的。',
    '崖心2技其實是大力喔，長知識了吧！',
    '伏擊客的那種收藏品，攻擊力增加+100% 可是周圍不能放幹員',
];
