import { Message } from 'discord.js';

export type MessageResponser = {
    desc: string;
    handler: (message: Message<true>) => string | undefined;
};
