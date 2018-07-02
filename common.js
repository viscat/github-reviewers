const STORAGE_KEY = 'reviwerProfiles';

const getProfiles = callback => {
    chrome.storage.sync.get(STORAGE_KEY, data => {
        return callback(data[STORAGE_KEY])
    })
}

const saveProfiles = (profiles) => {
    chrome.storage.sync.set({ [STORAGE_KEY]: profiles });
}

