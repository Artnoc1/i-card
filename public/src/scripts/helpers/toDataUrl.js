/**
 * 
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
function toDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = function () {
      resolve(reader.result);
    }
    reader.onerror = function (e) {
      reject(e);
    }
    reader.readAsDataURL(blob);
  });
}

export default toDataURL;