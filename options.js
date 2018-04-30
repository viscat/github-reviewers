document.getElementById('reviewer-ids').addEventListener('change', function (element) {
    let values = element.srcElement.value.trim();
    let reviewerIds = [];
    if (values !== "") {
        reviewerIds = values.split("\n");
    }
    chrome.storage.sync.set({reviewerIds: reviewerIds});
});

chrome.storage.sync.get('reviewerIds', function (data) {
    document.getElementById('reviewer-ids').value = data.reviewerIds.join("\n");
});