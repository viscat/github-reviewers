let button = document.createElement("button");
let element = document.querySelectorAll("button[aria-label='Request a review']")[0];
button.innerHTML = "Add reviewers";
button.type = "button";
button.classList.add("discussion-sidebar-heading");
button.classList.add("discussion-sidebar-toggle");
button.onclick = function(){
	chrome.storage.sync.get('reviewerIds', function(data) {
		let reviewerSelectors = "";
		let code = "";
		data.reviewerIds.forEach(function(id){
			reviewerSelectors += "input[value='"+id+"']:not(:checked),"
		});
		if (data.reviewerIds.length === 0) {
			alert("No reviewers configured");
			return;
		}
		if (!document.getElementById('review-filter-field').parentNode.parentNode.parentNode.parentNode.classList.contains('js-active-navigation-container')) {
			document.querySelectorAll("button[aria-label='Request a review']")[0].click();
		}
		setTimeout(function(){ 
			document.querySelectorAll(reviewerSelectors.slice(0,-1)).forEach(function(e){
				e.click()
			}); 
			console.log('b');
			document.querySelectorAll("button[aria-label='Request a review']")[0].click();
			console.log('c');
		}, 500);
	});
};
element.parentNode.insertBefore(button, element.nextSibling);