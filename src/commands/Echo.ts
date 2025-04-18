import { BotCommand } from '../utils';

export default new BotCommand('echo', '[ 指定 ] 讓機器人說出指定的內容') //
    .option_String('content', '要說的話', true)
    .callback((_, { content }) => {
        return { content };
    });
