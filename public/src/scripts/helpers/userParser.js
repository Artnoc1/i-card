/**
 * @returns {Array<string, string>}
 */
function queryParser() {
  const query = location.search.substr(1);
  const queryAr = query.split('&');
  const params = {};
  queryAr.map(param => {
    param = param.split('=');
    params[param[0]] = param[1];
  });
  return params;
}

export default queryParser;