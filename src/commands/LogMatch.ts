import { getAllMatchStorage, MatchState } from '../match';
import { createCommand } from '../commandUtils';
import { createLogString } from '../utils';
import { assertAdminPermission } from '../config';

export default createCommand('log_match', '[ 主辦方指令 ] 輸出所有頻道的BP流程情況') //
    .callback((ctx) => {
        assertAdminPermission(ctx);

        const storages = [...getAllMatchStorage()];

        return {
            content: !storages.length
                ? '無任何已設定的BP流程'
                : createLogString(
                      ...storages.map(({ channel, teams, state }) => {
                          return `**${channel.name}: ${teams[0].name} vs ${teams[1].name}** => ${matchStateWording[state]}`;
                      })
                  ),
            ephemeral: true,
        };
    });

const matchStateWording: Record<MatchState, string> = {
    [MatchState.running]: '進行中',
    [MatchState.pause]: '暫停',
    [MatchState.complete]: '待確認',
};
