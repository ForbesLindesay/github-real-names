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

<p>Search a string for "function", and display the position of the match:</p>

<button onclick="myFunction()">and go</button>

<p id="Path"></p>

<script>
function myFunction() {
    var str = "Visit W3Schools!"; 
    var n = str.search(/w3Schools/i);
    document.getElementById("Path").innerHTML = n;
}
</script>

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
