/**
 * @typedef {object} Dim
 * @property {string} unit
 * @property {number} value
 */
/**
 * 
 * @param {string} dim 
 * @return {Dim}
 */
function parseDim(dim) {
  let value = parseFloat(dim) + '';
  const unit = dim.replace(value, '');

  return {
    value: parseFloat(value),
    unit
  }
}

export default parseDim;