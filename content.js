document.addEventListener('pjax:end', function (event) {
    loadUI();
});
loadUI();

function loadUI() {
    let element = document.querySelectorAll("button[aria-label='Request a review']")[0];
    if (typeof element === 'undefined') {
        return;
    }

    if (!document.getElementById('copy-reviewers')) {
        element.parentNode.insertBefore(createCopyReviewersButton(), element.nextSibling);
    }
    if (!document.getElementById('paste-reviewers')) {
        element.parentNode.insertBefore(createPasteReviewersButton(), element.nextSibling);
    }
}

function createCopyReviewersButton() {
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
        chrome.storage.sync.set({reviewerIds: reviewerIds});
    };

    return button;
}

function createPasteReviewersButton() {
    let button = document.createElement("button");
    button.innerHTML = "Paste reviewers";
    button.type = "button";
    button.id = "paste-reviewers";
    button.classList.add("discussion-sidebar-heading");
    button.classList.add("discussion-sidebar-toggle");

    button.onclick = function () {
        chrome.storage.sync.get('reviewerIds', function (data) {
            let reviewerSelectors = "";
            data.reviewerIds.forEach(function (id) {
                reviewerSelectors += "input[value='" + id + "']:not(:checked),"
            });
            if (data.reviewerIds.length === 0) {
                alert("No reviewers configured");
                return;
            }
            let reviewersBox = document.getElementById('review-filter-field').parentNode.parentNode.parentNode.parentNode;
            if (!reviewersBox.classList.contains('js-active-navigation-container')) {
                document.querySelectorAll("button[aria-label='Request a review']")[0].click();
            }
            setTimeout(function () {
                document.querySelectorAll(reviewerSelectors.slice(0, -1)).forEach(function (e) {
                    e.click()
                });
                document.querySelectorAll("button[aria-label='Request a review']")[0].click();
                setTimeout(function () {
                    loadUI();
                }, 500);
            }, 500);
        });
    };
    return button;
}
