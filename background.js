const tabs = {};

chrome.runtime.onMessage.addListener( function( message, sender, sendResponse ) {
  if ( message.key === 'CTF_DOMReady' ) {
    if ( /(cdn|api|preview|images).contentful.com/.test( message.html ) ) {
      tabs[ sender.tab.id ].usesCtf = true;
      updateIcon( 'on' );
    }
  }
} );

function handleTabUpdate( tabId ) {
  let state = 'off';

  if ( tabs[ tabId ] ) {
    state = tabs[ tabId ].usesCtf ? 'on' : 'off';
  }

  updateIcon( state );
}

function updateIcon( state = 'off' ) {
  const title = state === 'off' ? 'Site doesn\'t use CTF' : 'Site uses CTF';

  chrome.browserAction.setTitle({ title });
  chrome.browserAction.setIcon( {
    path: `./icon-${ state }.png`
  } );
}

chrome.webRequest.onCompleted.addListener(
  function( info ) {
    if ( info.type === 'main_frame' ) {
      tabs[ info.tabId ] = {
        url     : info.url,
        usesCtf : false
      }
    }

    if ( /(cdn|api|preview|images).contentful.com/.test( info.url ) ) {
      tabs[ info.tabId ].usesCtf = true;
      updateIcon( 'on' );
    }
  },
  {
    urls: [
      'http://*/*',
      'https://*/*',
    ]
  }
);

chrome.tabs.onUpdated.addListener( handleTabUpdate );
chrome.tabs.onActivated.addListener( info => handleTabUpdate( info.tabId ) );