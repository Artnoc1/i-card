import routes from "./routes/routes";
import pushHistory from "./helpers/pushHistory";
import Page from "./page";

(function main() {
  window.addEventListener('load', app);
})();

function app() {
  let page = route();
  document.body.addEventListener('click', function (e) {
    const el = e.target;
    if (el instanceof HTMLAnchorElement) {
      e.preventDefault();
      pushHistory(el.href, page.state);
    }
  });
  window.addEventListener('navigation', function () {
    page = route() || page;
  });
  window.addEventListener('popstate', function () {
    page = route() || page;
  })
}

/**
 * @returns {Page}
 */
function route() {
  const path = location.pathname;
  if (path in routes) return routes[path]();
  alert('Page not exists');
}