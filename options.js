const DEFAULT_PROFILE = 'default'

let selectedProfile = DEFAULT_PROFILE

const profileSelector = document.getElementById('profile-selector');
const btnAddProfile = document.getElementById('btn-add-profile');
const btnRemoveProfile = document.getElementById('btn-remove-profile');
const reviwersArea = document.getElementById('reviewer-ids');


const bindAddProfile = () => {
    btnAddProfile.addEventListener('click', (e) => {
        e.preventDefault();
        let inputText = document.getElementById('input-profile-name')
        let newProfile = inputText.value
        if (newProfile.trim() !== '') {
            getProfiles((profiles) => {
                profiles[newProfile] = null;
                saveProfiles(profiles)
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
        getProfiles( profiles => {
            delete profiles[deleteProfile];

            saveProfiles(profiles)
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
    reviwersArea.addEventListener('change', function (element) {
        let values = this.value.trim();
        let reviewerIds = [];
        if (values !== "") {
            reviewerIds = values.split("\n");
        }
        getProfiles( profiles => {
            profiles[profileSelector.value] = reviewerIds
            saveProfiles(profiles)
            loadProfiles()
        })
    });
}

const loadProfiles = () => {
    profileSelector.innerHTML = '';
    getProfiles((profiles) => {
        if (profiles) {
            profileSelector.appendChild(createProfileOption(DEFAULT_PROFILE))
            delete profiles[DEFAULT_PROFILE]

            Object.keys(profiles).sort().forEach((profile) => {
                profileSelector.appendChild(createProfileOption(profile))
            })
        } else {
            chrome.storage.sync.get('reviewerIds', (data) => {
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
    reviwersArea.value = ''
    getProfiles((profiles) => {
        if (profiles[profile]) {
            reviwersArea.value = profiles[profile].join("\n");
        }
    });
}

bindAddProfile()
bindRemoveProfile()
bindSelectProfile()
bindReviwersAdded()
loadProfiles()