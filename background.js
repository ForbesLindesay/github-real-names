chrome.browserAction.onClicked.addListener(function (tab) {
  var showingRealNames = localStorage['showingRealNames'];
  showingRealNames = showingRealNames && JSON.parse(showingRealNames);
  if (showingRealNames === undefined) {
    showingRealNames = true;
  }
  showingRealNames = !showingRealNames;
  localStorage['showingRealNames'] = JSON.stringify(showingRealNames);
  chrome.tabs.sendMessage(tab.id, {action: 'toggle', showingRealNames: showingRealNames });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "get-showingRealNames") {
      var showingRealNames = localStorage['showingRealNames'];
      showingRealNames = showingRealNames && JSON.parse(showingRealNames);
      if (showingRealNames === undefined) {
        showingRealNames = true;
      }
      sendResponse({showingRealNames: showingRealNames});
    }
});
