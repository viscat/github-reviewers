let button = document.createElement("button");
let element = document.querySelectorAll("button[aria-label='Request a review']")[0];
button.innerHTML = "Add reviewers";
button.type = "button";
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
        }, 500);
    });
};
element.parentNode.insertBefore(button, element.nextSibling);