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

var ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "get-showingRealNames") {
      var showingRealNames = localStorage['showingRealNames'];
      showingRealNames = showingRealNames && JSON.parse(showingRealNames);
      if (showingRealNames === undefined) {
        showingRealNames = true;
      }
      sendResponse({showingRealNames: showingRealNames});
    }
    if (request.action === 'get-real-name') {
      var cached = localStorage['user:' + request.username];
      if (cached) {
        cached = JSON.parse(cached);
        if (cached.timestamp > Date.now() - ONE_WEEK) {
          sendResponse({cached: cached.realName});
        } else {
          sendResponse({cached: null});
        }
      }
    }
    if (request.action === 'set-real-name') {
      localStorage['user:' + request.username] = JSON.stringify({
        realName: request.realName,
        timestamp: Date.now()
      });
      sendResponse({});
    }
});
