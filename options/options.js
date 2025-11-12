//DOM Elements
const element = {
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

function getDefaultConfig(){}

function saveConfiguration(){}

function setupEventListners(){}

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

