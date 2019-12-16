/**
 * 
 * @param {string} url 
 * @param {object} [state] 
 * @param {string} [title]
 */
function pushHistory(url, state = null, title = null) {
  if (location.href === url) return;
  window.history.pushState(state, title, url);
  const event = new CustomEvent('navigation', {
    cancelable: true
  });
  window.dispatchEvent(event);
}

export default pushHistory;