import { createTimeoutHandler, TimeoutHandler } from '../utils';

let timer: TimeoutHandler | undefined;

let isSilence = false;

export const getSilenceState = () => isSilence;

export const forceSilence = () => {
    timer?.cancel();
    timer = createTimeoutHandler(180 * 1000, () => (isSilence = false));
    if (isSilence) return '阿是要我閉嘴幾次？';
    isSilence = true;
    return Math.random() > 0.5 ? '兇屁阿，好啦我暫時閉嘴行吧' : '好，我閉嘴，我看你BP時怎麼選角';
};
