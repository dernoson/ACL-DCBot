import { MessageResponser } from './types';

export const winsok: MessageResponser = {
    desc: 'win神好可愛',
    handler(message) {
        if(message.author.username == 'winsok') return '# 好強啊winsok'
    },
};