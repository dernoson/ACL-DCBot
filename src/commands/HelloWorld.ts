import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { botEnv, dumpSetting } from '../config/botSettings';
import { CommandFunction } from '../types';
import { checkAdminPermission } from '../utils';

export const HelloWorld: CommandFunction = (ctx) => {
    checkAdminPermission(ctx);
    if (!botEnv.get('HelloWorld')) throw '我已經打招呼過了~';
    botEnv.set('HelloWorld', 0);
    dumpSetting();
    return '\
嗨~大家好~\n\
聽說合約要到了呢，這次第三屆ACL比賽就由我ACL助手機器人幫助大家進行每天的賽程~\n\
\n\
想知道我有什麼指令可以使用的話，可隨時使用`/help`指令查看。\n\
\n\
為了這次比賽的公平公正，目前我的程式碼內容也全部公開在github上了。\n\
```https://github.com/dernoson/ACL-DCBot```\n\
\n\
最後，期待大家比賽時的精采表現！！！';
};

export default {
    func: HelloWorld,
    defs: new SlashCommandBuilder()
        .setName('hello_world')
        .setDescription('大家好')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
};
