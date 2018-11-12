const DEFAULT_PROFILE = 'default';

document.addEventListener('pjax:end', function (event) {
    loadUI();
});
loadUI();

function loadUI() {
    let element = document.querySelector('.discussion-sidebar-item');
    if (!element) {
        return;
    }

    getProfiles(profiles => {
        if (profiles) {
            if (Object.keys(profiles).length > 1) {
                createSelectors(element, profiles);
            } else {
                createButtons(element);
            }
        } else {
            chrome.storage.sync.get('reviewerIds', (data) => {
                let defaultValue = data['reviewerIds'] ? data['reviewerIds'] : [];
                saveProfiles({ [DEFAULT_PROFILE]: defaultValue });
                loadUI();
            });
        }
    })
}

const createButtons = element => {
    if (!document.getElementById('copy-reviewers')) {
        element.parentNode.insertBefore(createCopyReviewersButton(), element.nextSibling);
    }
    if (!document.getElementById('paste-reviewers')) {
        element.parentNode.insertBefore(createPasteReviewersButton(), element.nextSibling);
    }
};

const createSelectors = (element, profiles) => {
    if (!document.getElementById('copy-reviewers')) {
        element.parentNode.parentNode.parentNode.insertBefore(createCopyReviewersSelector(profiles), element.nextSibling);
    }
    if (!document.getElementById('paste-reviewers')) {
        element.parentNode.parentNode.parentNode.insertBefore(createPasteReviewersSelector(profiles), element.nextSibling);
    }
};

const createCopyReviewersButton = () => {
    let button = document.createElement("button");
    button.id = "copy-reviewers";
    button.innerHTML = "Copy reviewers";
    button.type = "button";
    button.classList.add("discussion-sidebar-heading");
    button.classList.add("discussion-sidebar-toggle");

    button.onclick = function () {
        let reviewerIds = [];
        document.querySelectorAll('.js-hovercard-left').forEach(function (reviewer) {
            reviewerIds.push(reviewer.getAttribute('data-hovercard-user-id'));
        });

        saveProfiles({ [DEFAULT_PROFILE]: reviewerIds });
    };

    return button;
};

const createPasteReviewersButton = () => {
    let button = document.createElement("button");
    button.innerHTML = "Paste reviewers";
    button.type = "button";
    button.id = "paste-reviewers";
    button.classList.add("discussion-sidebar-heading");
    button.classList.add("discussion-sidebar-toggle");

    button.onclick = function () {
        getProfiles(profiles => {
            if (profiles[DEFAULT_PROFILE].length < 1) {
                alert("No reviewers configured");
                return;
            }
            appendReviewers(profiles[DEFAULT_PROFILE]);
        });
    };
    return button;
};

const createCopyReviewersSelector = profiles => {
    let select = document.createElement('select');
    select.style.width = '100%';

    select.id = 'copy-reviewers';

    let emptyOption = document.createElement('option');
    emptyOption.label = 'Select copy profile';
    emptyOption.selected = true;
    emptyOption.disabled = true;
    emptyOption.value = null;

    select.appendChild(emptyOption);

    Object.keys(profiles).forEach(function (profile) {
        let optionProfile = document.createElement('option');
        optionProfile.label = profile;
        optionProfile.value = profile;
        select.appendChild(optionProfile);
    });

    select.addEventListener('change', function (e) {
        let selectedProfile = this.value;
        let reviewerIds = [];
        document.querySelectorAll('.js-hovercard-left').forEach(function (reviewer) {
            reviewerIds.push(reviewer.getAttribute('data-hovercard-user-id'));
        });

        getProfiles(profiles => {
            profiles[selectedProfile] = reviewerIds;
            saveProfiles(profiles);
            this.childNodes[0].selected = true;
            alert(`Reviewers copied to ${selectedProfile}`)
        });
    });

    let wrapper = document.createElement('p');
    wrapper.appendChild(select);

    return wrapper;
};

const createPasteReviewersSelector = profiles => {
    let select = document.createElement('select');
    select.style.width = '100%';
    select.id = 'paste-reviewers';

    let emptyOption = document.createElement('option');
    emptyOption.label = 'Select paste profile';
    emptyOption.selected = true;
    emptyOption.disabled = true;

    select.appendChild(emptyOption);

    Object.keys(profiles).forEach(function (profile) {
        let optionProfile = document.createElement('option');
        optionProfile.label = profile;
        optionProfile.value = profile;
        select.appendChild(optionProfile);
    });

    select.addEventListener('change', function (e) {
        e.preventDefault();
        const selectedProfile = this.value;

        getProfiles(profiles => {
            if (profiles[selectedProfile].length < 1) {
                alert("No reviewers configured for the selected profile");
                return;
            }
            appendReviewers(profiles[selectedProfile]);
        });

    });
    let wrapper = document.createElement('p');
    wrapper.appendChild(select);

    return wrapper;
};

const appendReviewers = (reviewers) => {
    let reviewerSelectors = reviewers.reduce((result, id) => result + "input[value='" + id + "']:not(:checked),", '');

    let reviewersBox = document.getElementById('review-filter-field').parentNode.parentNode.parentNode.parentNode;
    if (!reviewersBox.classList.contains('js-active-navigation-container')) {
        document.querySelector("summary[data-hotkey='q']").click();
    }

    setTimeout(function () {
        document.querySelectorAll(reviewerSelectors.slice(0, -1)).forEach(function (e) {
            e.click();
        });
        document.querySelector("summary[data-hotkey='q']").click();
        setTimeout(function () {
            loadUI();
        }, 500);
    }, 500);
};

