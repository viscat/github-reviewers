const STORAGE_KEY = 'reviwerProfiles';
const DEFAULT_PROFILE = 'default'

let selectedProfile = DEFAULT_PROFILE

const profileSelector = document.getElementById('profile-selector');
const btnAddProfile = document.getElementById('btn-add-profile');
const btnRemoveProfile = document.getElementById('btn-remove-profile');


const bindAddProfile = () => {
    btnAddProfile.addEventListener('click', (e) => {
        e.preventDefault();
        let inputText = document.getElementById('input-profile-name')
        let newProfile = inputText.value
        if (newProfile.trim() !== '') {
            chrome.storage.sync.get(STORAGE_KEY, function (data) {
                data[STORAGE_KEY][newProfile] = null;
                saveProfiles(data[STORAGE_KEY])
                loadProfiles()
            })
        }
        inputText.value = ''
    })
}

const bindRemoveProfile = () => {
    btnRemoveProfile.addEventListener('click', (e) => {
        e.preventDefault();
        let deleteProfile = profileSelector.value
        chrome.storage.sync.get(STORAGE_KEY, function (data) {
            delete data[STORAGE_KEY][deleteProfile];

            saveProfiles(data[STORAGE_KEY])
            selectedProfile = DEFAULT_PROFILE
            loadProfiles()
        })
    })
}

const bindSelectProfile = () => {
    profileSelector.addEventListener('change', function(){
        selectedProfile = this.value
        getProfileData(this.value)
    })
}

const bindReviwersAdded = () => {
    document.getElementById('reviewer-ids').addEventListener('change', function (element) {
        let values = this.value.trim();
        let reviewerIds = [];
        if (values !== "") {
            reviewerIds = values.split("\n");
        }
        chrome.storage.sync.get(STORAGE_KEY, function (data) {
            data[STORAGE_KEY][profileSelector.value] = reviewerIds
            saveProfiles(data[STORAGE_KEY])
            loadProfiles()
        })
    });
}

const loadProfiles = () => {
    profileSelector.innerHTML = '';
    chrome.storage.sync.get(STORAGE_KEY, function (data) {
        if (data[STORAGE_KEY]) {
            let profiles = data[STORAGE_KEY]
            profileSelector.appendChild(createProfileOption(DEFAULT_PROFILE))
            delete profiles[DEFAULT_PROFILE]

            Object.keys(profiles).sort().forEach((profile) => {
                profileSelector.appendChild(createProfileOption(profile))
            })
        } else {
            chrome.storage.sync.get(STORAGE_KEY, (data) => {
                let defaultProfile = document.createElement('option')
                defaultProfile.label = DEFAULT_PROFILE
                defaultProfile.value = DEFAULT_PROFILE
                profileSelector.appendChild(defaultProfile)

                saveProfiles({ [DEFAULT_PROFILE]: data })
            });
        }
        getProfileData(selectedProfile);
    });
}

const createProfileOption = (profile) => {
    let option = document.createElement('option')
    option.label = profile
    option.value = profile
    option.selected = selectedProfile === profile ? true : false
    
    return option;
}

const getProfileData = (profile) => {
    let inputArea = document.getElementById('reviewer-ids')
    inputArea.value = ''
    chrome.storage.sync.get(STORAGE_KEY, function (data) {
        if (data[STORAGE_KEY][profile]) {
            inputArea.value = data[STORAGE_KEY][profile].join("\n");
        }
    });
}

const saveProfiles = (profiles) => {
    chrome.storage.sync.set({ [STORAGE_KEY]: profiles });
}

bindAddProfile()
bindRemoveProfile()
bindSelectProfile()
bindReviwersAdded()
loadProfiles()