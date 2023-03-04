import { MessageResponser } from './types';

export const grapeFruitify: MessageResponser = {
    desc: 'YT實況主的神軸提供(不一定回應，關鍵字：軸)',
    handler(message) {
        const randNum = Math.floor(Math.random() * 6);
        if (!message.content.includes('軸')) return;
        return responseStr[randNum];
    },
};

const responseStr = [
    '你知道遠牙開技能會降敵人防禦嗎？',
    '我覺得因為早露比不上號角，所以不要練早露。',
    'W的閃避機率高達40%！！！',
    '黑的出場率很爛，像我淵默都不放黑的。',
];
