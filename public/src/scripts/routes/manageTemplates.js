import tag from 'html-tag-js';
import Page from '../page';

import _template from '../../templates/manageTemplates.hbs';
import ajax from '@deadlyjack/ajax';
import Toast from '../helpers/toast';
import dialogs from '../helpers/dialogs';

function ManageTemplates(state) {
  const page = new Page(_template, 'Manage Template', state);
  const $imagesContainer = tag.get('#images-container');

  $imagesContainer.addEventListener('click', function (e) {
    const el = e.target;
    const action = el.getAttribute('action');
    const id = el.getAttribute('data-id');
    if (action === 'delete') {
      dialogs.confirm('CONFIRM', 'Delete this template?')
        .then(() => {
          deleteTemplate(id);
        });
    }
  });

  ajax({
      url: '/templates',
      responseType: 'json'
    })
    .then(res => {
      if (res.status === 'ok') {
        loadTemplates(res.templates);
      } else {
        Toast(res.error, {
          type: 'error'
        });
      }
    })
    .catch(err => {
      console.log(err);
    })

  function loadTemplates(res) {
    for (let name in res) {
      /**
       * @type {Array<string>}
       */
      const images = res[name];
      const $btn = tag('button', {
        textContent: 'delete',
        className: 'warning',
        attr: {
          action: 'delete',
          "data-id": name
        }
      });
      const $imgs = tag('div', {
        className: 'images'
      });
      const $imageContainer = tag('div', {
        className: 'image-container',
        id: name,
        children: [$imgs, $btn]
      });
      for (let img of images) {
        const $img = tag('img', {
          src: '/template/' + name + '/' + img,
          alt: img
        });
        $imgs.append($img);
      }

      $imagesContainer.append($imageContainer);
    }
  }

  return page;
}

function deleteTemplate(id) {
  Toast('Deleting template ' + id);
  ajax({
      url: '/template/' + id,
      method: 'delete'
    })
    .then(res => {
      if (res.status === 'ok') {
        Toast('Deleting template ' + id, {
          type: 'success'
        });
        const $container = document.getElementById(id);
        if ($container) $container.remove();
      } else {
        Toast('Failed! Reason - ' + res.error);
      }
    })
    .catch(err => {
      console.log(err);
    });
}

export default ManageTemplates;