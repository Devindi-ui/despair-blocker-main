//DOM Elements
const elements = {
    newSiteInput: document.getElementById('newSiteInput'),
    addSiteBtn: document.getElementById('addSiteBtn'),
    sitesList: document.getElementById('sitesList'),

    scheduleEnabled: document.getElementById('scheduleEnabled'),
    scheduleSettings: document.getElementById('scheduleSettings'),
    startTime: document.getElementById('startTime'),
    endTime: document.getElementById('endTime'),
    workdayCheckboxes: document.getAnimations('.workday-checkbox'),

    newMessageInput: document.getElementById('newMessageInput'),
    addMessageBtn: document.getElementById('addMessageBtn'),
    messageList: document.getElementById('messageList'),

    anableTTS: document.getElementById('enableTTS'),
    saveBtn: document.getElementById('saveBtn'),
    resetBtn: document.getElementById('resetBtn'),
    testBtn: document.getElementById('testBtn'),

    statusMessage: document.getElementById('statusMessage'),
}

//current configuration status
let currentConfig = null;

//initialize the option page
document.addEventListener('DOMContentLoaded',async () => {
    try {
        await loadConfiguration();
        setupEventListners();
        updateUI();
        showStatus('Settings loaded successfully!', 'success');
    } catch (error) {
        console.error('Options initialization error: ',error);
        showStatus('Error loading settings', 'error');        
    }
});

/**
 * Load Configurations from storage
 */
async function loadConfiguration() {
    try {
        const result = await chrome.storage.sync.get(['config']);
        if (result.config) {
            currentConfig = result.config;
        } else {
            currentConfig = getDefaultConfig();
            await saveConfiguration();
        }
    } catch (error) {
        console.error('Configuration load error:', error);
        currentConfig = getDefaultConfig();
        
    }
}

function getDefaultConfig(){
    return {
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
}

async function saveConfiguration(){
    try {
        await chrome.storage.sync.set({config: currentConfig});
        chrome.runtime.sendMessage({action: 'updateSchedule'});
        return true;
    } catch (error) {
        console.error('Configuration save error:', error);
        return false;
    }
}

function setupEventListners(){
    //sites management
    elements.addSiteBtn.addEventListener('click', addSite);
    elements.newSiteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addSite();
        }
    });

    //schedule management
    elements.scheduleEnabled.addEventListener('change', toggleSchedule);
    elements.startTime.addEventListener('change', updateScheduleTime);
    elements.endTime.addEventListener('change', updateScheduleTime);
    elements.workdayCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateWorkDays);
    });

    //messages management
    elements.addMessageBtn.addEventListener('click', addMessage);
    elements.workdayCheckboxes.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            addMessage();
        }
    });

    //additionql settings
    elements.enableTTS.addEventListener('change', updateTTSSettings);

    //action buttons
    elements.saveBtn.addEventListener('click', saveSettings);
    elements.resetBtn.addEventListener('click', resetSettings);
    elements.testBtn.addEventListener('click', testBlockMessage);
}

function updateUI(){}

function updateSiteList(){}

function updateMessageList(){}

function addSite(){}

function removeSite(){

}

function cleanSiteUrl(){}

function toggleSchedule(){}

function toggleScheduleVisibillity(){}

function updateScheduleTime(){}

function updateWorkDays(){}

function addMessage(){}

function removeMessage(){}

function updateTTSSettings(){}

async function saveSettings(){}

async function  resetSettings() {
    
}

function testBlockMessage(){}

function showStatus(){} 

