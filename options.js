document.getElementById('reviewer-ids').addEventListener('change', function(element) {
  console.log(element.srcElement.value.split("\n"));
  let values = element.srcElement.value.trim();
  let reviewerIds = [];
  
  if (values !== "") {
    reviewerIds = values.split("\n");
  }

  chrome.storage.sync.set({reviewerIds: reviewerIds});
});

chrome.storage.sync.get('reviewerIds', function(data) {
  console.log(data);
  document.getElementById('reviewer-ids').value = data.reviewerIds.join("\n");
});