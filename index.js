'use strict';

var url = require('url');
var request = require('then-request');

var showingRealNames = true;
var realNames = {
};

function loadRealName(username) {
  if (realNames[username ]) return;
  realNames[username] = username;
  chrome.runtime.sendMessage({action: "get-real-name", username: username}, function(response) {
    if (response && response.cached) {
      realNames[username] = response.cached;
      update();
      return;
    }
    request('GET', url.resolve('https://api.github.com/users/', username)).getBody().done(function (res) {
      res = JSON.parse(res);
      if (res.name) {
        realNames[username] = res.name;
        chrome.runtime.sendMessage({action: "set-real-name", username: username, realName: res.name}, function(response) {
        });
      }
      update();
    });
  });
}

chrome.runtime.sendMessage({action: "get-showingRealNames"}, function(response) {
  showingRealNames = response.showingRealNames;
  update();
  setInterval(update, 1000);
});

function updateList(list, filter, getUsername, shouldAt) {
  for (var i = 0; i < list.length; i++) {
    if (filter(list[i])) {
      var username = getUsername(list[i]);
      loadRealName(username);
      if (showingRealNames && realNames[username] && realNames[username] !== username) {
        list[i].textContent = realNames[username];
      } else {
        list[i].textContent = (shouldAt ? '@' : '') + username;
      }
    }
  }
}
function update() {
  updateList(document.getElementsByClassName('author'), function (author) {
    return author.hasAttribute('href');
  }, function (author) {
    return /\/([^\/]+)$/.exec(author.getAttribute('href'))[1];
  });
  updateList(document.querySelectorAll("[data-ga-click*='target:actor']"), function (author) {
    return author.hasAttribute('href');
  }, function (author) {
    return /\/([^\/]+)$/.exec(author.getAttribute('href'))[1];
  });
  updateList(document.getElementsByClassName('user-mention'), function (mention) {
    return mention.hasAttribute('href');
  }, function (mention) {
    return /\/([^\/]+)$/.exec(mention.getAttribute('href'))[1];
  }, true);
  updateList(document.getElementsByClassName('commit-author'), function (author) {
    return true;
  }, function (author) {
    if (author.hasAttribute('data-user-name')) {
      return author.getAttribute('data-user-name');
    } else {
      var username = author.textContent;
      if (username.indexOf('author=') !== -1) {
        username = username.split('author=').pop();
      }
      author.setAttribute('data-user-name', username);
      return username;
    }
  });
  updateList(document.querySelectorAll('.opened-by a.tooltipped.tooltipped-s'), function (author) {
    return true;
  }, function (author) {
    if (author.hasAttribute('data-user-name')) {
      return author.getAttribute('data-user-name');
    } else {
      var username = author.textContent;
      author.setAttribute('data-user-name', username);
      return username;
    }
  });
  updateList(document.querySelectorAll('.author-name a[rel="author"], .author a[rel="author"]'), function (author) {
    return author.hasAttribute('href');
  }, function (author) {
    return /\/([^\/]+)$/.exec(author.getAttribute('href'))[1];
  });
  updateList(document.querySelectorAll('.opened-by a.Link--muted'), function (author) {
    return true;
  }, function (author) {
    if (author.hasAttribute('data-user-name')) {
      return author.getAttribute('data-user-name');
    } else {
      var username = author.textContent;
      author.setAttribute('data-user-name', username);
      return username;
    }
  });
  updateList(document.querySelectorAll('.sidebar-assignee p span.text-bold'), function (author) {
    return true;
  }, function (author) {
    if (author.hasAttribute('data-user-name')) {
      return author.getAttribute('data-user-name');
    } else {
      var username = author.textContent;
      author.setAttribute('data-user-name', username);
      return username;
    }
  });
  updateList(document.querySelectorAll('a.assignee > .css-truncate-target'), function (author) {
    return /\/([^\/]+)$/.test(author.parentNode.getAttribute('href'));
  }, function (author) {
    if (!author.style.maxWidth) {
      author.style.maxWidth = '250px';
    }
    return /\/([^\/]+)$/.exec(author.parentNode.getAttribute('href'))[1];
  });
}

update();
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'toggle') {
    showingRealNames = message.showingRealNames;
    update();
  }
});
