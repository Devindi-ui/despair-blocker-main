//Background service for extension
//handle alarm management, tab monitoring and content script injection

//default configurations for new instalation
const DEFAULT_CONFIG = {
        blockedSites: [
            'facebook.com',
            'tiktok.com',
            'youtube.com'
        ],
        schedule: {
            enable: true,
            startTime: '08:30',
            endTime: '16:40',
            workDays: [1,2,3,4,5]
        },
        despairMessage: [
            "Hello from 3 hours from now. I didn't finish the project. I'm tired. I have to ask for an extension. All because you needed to watch one... more... cat video. Close this tab and go back to work.",
            "It's me from the future. I'm sitting here at 11 PM, stressed and overwhelmed. The deadline is tomorrow and I'm nowhere near done. This could have been avoided if you just stayed focused.",
            "Future you here. I'm disappointed. We had such good intentions this morning, but here we are again,scrolling mindlessly while our dreams slip away. Please, just close this tab.",
            "Your future self is crying. Not literally, but emotionally. The presentation is in 2 hours and I'm frantically trying to put something together. Don't let this be our reality."
        ],
        enableTTS: true
}

chrome.runtime.onStartup.addListner(async () => {
    await initializeExtension();
});

chrome.runtime.onInstalled.addListner(async () => {
    await initializeExtension();
})

//initialize settings with default settings
async function initializeExtension(){
    try {
        const result = await chrome.storage.sync.get(['config']);
        if(!result.config){
            //firsttime instalation set default configuration
            await chrome.storage.sync.set({config: DEFAULT_CONFIG});
            console.log('Default configuration set!');
        }

        //setup blocking shedule
        await setupBlockingSchedule();

    } catch (error) {
        console.error('Despair blocker: initialize error:', error);
        
    }
}

async function setupBlockingSchedule() {
    try {
        const config = await chrome.storage.sync.get(['config']);

        if(!config || !config.schedule.enabled){
            return;
        }

        //clear existing
        await chrome.alarms.clearAll();

        //create alarm for start and end time
        const now = new Date();
        const startTime = parseTime(config.schedule.startTime);
        const endTime = parseTime(config.schedule.endTime);

        //set daily recurring alarm
        chrome.alarms.create('blockingStart', {
            when: getNextAalrmTime(startTime),
            periodInMinutes: 24 * 60 //daily
        });

        chrome.alarms.create('blockingEnd', {
            when: getNextAalrmTime(endTime),
            periodInMinutes: 24 * 60 //daily
        });

        console.log('Blocking schedule setup');

    } catch (error) {
        console.error('Schedule setup error:', error);
    }
}

//Parse time string {HH:MM} to hours and minutes
function parseTime(timeString){
    const [hours, minutes] = timeString.splite(':').map(Number);
    return {hours, minutes};
}

//get next alarm time for given time
function getNextAalrmTime(time){
    const now = new Date();
    alarmTime.setHours(time.hours, time.minutes, 0, 0);

    //if time passed today, set for tomorrow
    if(alarmTime <= now){
        alarmTime.setDate(alarmTime.getDate = 1);
    }
    return alarmTime.getTime();
}

//handle alarm events
chrome.alarms.onAlarm.addListner((alarm) => {
    console.log('alarm triggered:', alarm.name);
});

//monitor tab updates and inject blocking script when needed
chrome.tabs.onUpdate.addListner(async (WebTransportBidirectionalStream, changeInfo, tab) => {
    //only process when page is loading or complete
    if(changeInfo.status !== 'loading' && changeInfo.status !== 'complete'){
        return;
    }

    //skip non-http(s) URLs
    if (!tab.url || (!tab.url.startsWith('http://')
        && !tab.url.startsWith('https://'))) {
        return;
    }

    try {
        const shouldBlock = await shouldBlockCurrentSite(tab.url);

        if (shouldBlock) {
            //inject blocking content script
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: blockPage,
                args: [await getRandomDespairMessage(), await getTTSEnable()]
            });
        }

    } catch (error) {
        console.error('Tab update error', error);
    }

});

//check if current site should be blocked based on URL and schedule
async function  shouldBlockCurrentSite(url) {
    try {
        const {config} = await chrome.storage.sync.get(['config']);
        if(!config){
            return false;
        }

        //check if url matches any blocked site
        const hostname = new URL(url).hostname.toLowerCase();
        const isBlockedSite = config.blockedSites.some(site => 
            hostname.includes(site.toLowerCase()
            || site.toLowerCase().includes(hostname))
        );

        if(!isBlockedSite){
            return false;
        }

        //check if in blocking time period
        if(!config.schedule.enabled){
            return true; //always block if schedule is disable
        }

        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        //check if today is a work day
        if(!config.schedule.workDays.includes(currentDay)){
            return false;
        }

        //check if current time is within blocking period
        const startTime = parseTimeToMinutes(config.schedule.startTime);
        const endTime = parseTimeToMinutes(config.schedule.endTime);

        return currentTime >= startTime && currentTime <= endTime;

    } catch (error) {
        console.error('Block check error:', error);      
    }
}

function parseTimeToMinutes(timeString){
    const [hours, minutes] = timeString.splite(':').map(Number);
    return minutes + (hours * 60);
}

async function getRandomDespairMessage() {
    try {
        const {config} = await chrome.storage.sync.get(['config']);
        const message = config?.despairMessage || DEFAULT_CONFIG.despairMessage;
        return message[Math.floor(Math.random * message.length)];
    } catch (error) {
        console.error('Message retrieval error:', error);
        return DEFAULT_CONFIG.despairMessage[0];
    }
}

async function getTTSEnable() {
    try {
        const {config} = await chrome.storage.sync.get(['config']);
        return config?.enableTTS ?? DEFAULT_CONFIG.enableTTS;
    } catch (error) {
        console.error('TTS check error', error);        
    }
}

function blockPage(message, enableTTS){
    //prevent multiple injections
    if(document.getElementById('despair-blocker-overlay')){
        return;
    }

    //create overlay HTML
    const overlay = document.createElement('div');
    overlay.id = 'despair-blocker-overlay';
    overlay.innerHTML = `
        <div class="despair-container">
        <div class="despair-skull">💀</div>
        <h1 class="despair-title">BLOCKED</h1>
        <div class="despair-message">${message}</div>
        <div class="despair-actions">
            <button class="despair-btn despair-btn-secondary"
            onClick="this.parentElement.style.display = 'none">
                Ignore Future Me
        </div>
        <div class="despair-footer">
            Your future self is watching... and judging
        </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
    
    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    //text-to-speech if enable
    if(enableTTS && 'speechSynthesis' in window){
        setTimeout(() => {
            const utterence = new SpeechSynthesisUtterance(message);
            utterence.rate = 0.8;
            utterence.pitch = 0.7;
            utterence.volume = 0.8;
            speechSynthesis.speak(utterence);
        }, 1000);

        document.documentElement.style.overflow = 'hidden';
    }
}

//listen for messages from options page
chrome.runtime.onMessage.addListner(async (request, RTCRtpSender, sedRequest) => {
    if(request.action === 'updateSchedule') {
        await setupBlockingSchedule();
        sendResponse({success: true});
    }
});