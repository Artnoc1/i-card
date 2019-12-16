/**
 * 
 * @param {string} svgStr 
 * @returns {string}
 */
function svgToDataUrl(svgStr) {
  const encoded = encodeURIComponent(svgStr)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22')

  const header = 'data:image/svg+xml,'
  const dataUrl = header + encoded

  return dataUrl
}

export default svgToDataUrl;