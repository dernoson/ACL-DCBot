import { MessageResponser } from './types';
import { getRandomInt } from './utils';

export const shadow: MessageResponser = {
    desc: '天佑拉華純特32(關鍵字：演)',
    handler(message) {
        if (message.content.includes('演')) {
            const randStr = responseStr[getRandomInt(responseStr.length)];
            return '傀影：今天我想來點' + randStr;
        }
    },
};

const responseStr = ['暈眩', '束縛', '緩速', '無他欸~無他欸~無他欸~'];
