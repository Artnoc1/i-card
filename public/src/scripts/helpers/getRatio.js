import tag from 'html-tag-js';
/**
 * 
 * @param {'px'|'pt'|'em'|'rem'|'pc'} unit 
 * @returns {number}
 */
function getRatio(unit) {
  const $testTag = tag('div', {
    style: {
      height: '1' + unit,
      width: '1' + unit,
      position: 'abosolute'
    }
  });

  document.body.appendChild($testTag);
  const testClient = $testTag.getBoundingClientRect();
  $testTag.remove();

  return (1 / testClient.width);
}

export default getRatio;