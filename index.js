console.log(`[idle_duration_skip] start`);

import { MacrosParser, getLastMessageId } from '../../../macros.js';
import { moment } from '../lib.js';
import { timestampToMoment } from '../../../utils.js';
import { getContext } from '../../../extensions.js';

/**
 * Counts backwards over the user messages until the count is reached
 * then returns a human formatted description of the time since that message.
 * Like {idle_duration} getLastUserMessageDate()
 * but lets you choose how many user messages to seek back.
 * @param {string} skipCount The number of user messages to skip.
 * @returns {string} Human readable description of the duration.
 */
function getLastUserMessageDateSkip(skipCount) {
    console.log(`[idle_duration_skip] getLastUserMessageDateSkip(${skipCount})`);

    let skipCountNum = 0;
    if (skipCount) {
        skipCountNum = parseInt(skipCount, 10);
        if (isNaN(skipCountNum) || skipCountNum < 0) {
            console.error(`[idle_duration_skip] invalid parameter ${skipCount} returning empty string`);
            return '';
        }
    }

    let count = 0;

    const messageIndex = getLastMessageId({ 
        filter: m => {
            if (m.is_user && !m.is_system) {
                count++;
                return count > skipCountNum;
            }
            return false;
        }
    });

    let durationMessage = 'just now';

    if (messageIndex) {
        const chat = getContext().chat;
        
        console.log(`[idle_duration_skip] Found matching message #${messageIndex}`);

        const lastMessage = chat[messageIndex];

        if (lastMessage?.send_date) {
            const now = moment();
            const lastMessageDate = timestampToMoment(lastMessage.send_date);
            const duration = moment.duration(now.diff(lastMessageDate));
            durationMessage = duration.humanize();
        }
    } else {
        console.log(`[idle_duration_skip] No last user message found with skip ${skipCountNum}`);
    }

    console.log(`[idle_duration_skip] durationMessage=${durationMessage}`);

    return durationMessage;
}

const init = ()=>{
    console.log(`[idle_duration_skip] Loading`);
    // Current ST api doesn't expose the ability to accept parameters, so we'll just register a few.
    // Possible improvement is to make this a setting until parameters are exposed in the ST api.
    for (let i = 1; i < 5; i++) {
        const macroName = `idle_duration_skip:${i}`;
        console.log(`[idle_duration_skip] Registering {{${macroName}}}`);
        MacrosParser.registerMacro(macroName, () => getLastUserMessageDateSkip(i), `Like idle_duration but skips ${i}`);
    }
};
init();