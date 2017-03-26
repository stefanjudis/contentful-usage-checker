chrome.runtime.sendMessage( {
  key  : 'CTF_DOMReady',
  html : document.documentElement.innerHTML
} );