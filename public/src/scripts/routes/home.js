import ajax from '@deadlyjack/ajax';
import tag from 'html-tag-js';
import mustache from 'mustache';

import _template from '../../templates/home.hbs';
import _template2 from '../../templates/selectTemplate.hbs';
import Page from "../page";
import Toast from '../helpers/toast';
import dialogs from '../helpers/dialogs';
import toDataURL from '../helpers/toDataUrl';
import svgToDataUrl from '../helpers/svgToDataUrl';

function Home(state) {
  const page = new Page(_template, 'i-card', state);
  const $select = tag.get('#selectTemplate');
  const $search = tag.get('#form');

  $search.addEventListener('click', function (e) {
    const el = e.target;
    const action = el.getAttribute('action');
    if (action === 'submit') {
      if (!window.defaultTemplate) return selectBox(search);
      search();
    }

    function search() {
      const $name = tag.get('#name');
      const $branch = tag.get('#branch');
      const $batch = tag.get('#batch');

      printIcard($name.value, $branch.value, $batch.value);
    }
  });
  $select.addEventListener('click', () => callback());

  return page;
}

function selectBox(callback) {
  ajax({
      url: '/templates'
    })
    .then(res => {
      if (res.status === 'ok')
        return renderBox(res.templates);
      Toast(res.error, {
        type: 'error'
      });
    })
    .catch(err => {
      console.log(err);
    })

  function renderBox(templates) {
    let view = [];
    for (let key in templates) {
      let template = {
        id: key,
        images: []
      };

      for (let img of templates[key]) {
        template.images.push({
          src: `/template/${key}/${img}`,
          alt: img
        });
      }

      view.push(template);
    }
    const _html = mustache.render(_template2, {
      templates: view
    });
    dialogs.iBox('Select template', _html)
      .then(res => {
        const id = res.getAttribute('data-id');
        if (!id) return;
        window.defaultTemplate = id;
        if (callback) callback();
        Toast('Default template updated...', {
          type: 'success'
        });
      });
  }
}
/**
 * 
 * @param {string} name 
 * @param {string} branch 
 * @param {string} batch 
 */
function printIcard(name, branch, batch) {
  ajax({
      url: `/data?name=${name}&branch=${branch}&batch=${batch}`,
      responseType: 'json'
    })
    .then(res => {
      if (res.status === 'ok') {
        if (res.result.length === 0)
          Toast(name + ' not found', {
            type: 'error'
          });
        else
          generateIDCard(res.result);
      } else {
        Toast(res.error, {
          type: 'error'
        });
      }
    });
}

/**
 * @typedef {object} User
 * @property {number} id
 * @property {string} name
 * @property {string} dob
 * @property {string} branch
 * @property {string} batch
 * @property {string} booldGroup
 * @property {string} fathername
 * @property {string} mothername
 * @property {string} address
 */

/**
 * 
 * @param {Array<User>} users 
 */
function generateIDCard(users) {
  const $imagesContainer = tag.get('#images-container');
  $imagesContainer.textContent = '';
  getTemplates()
    .then(res => {
      if (res.status === 'ok') {
        drawCard(res.result);
      }
    })

  function drawCard(images) {
    for (let user of users) {
      const $container = tag('div', {
        className: 'images'
      });
      $imagesContainer.append(tag('div', {
        className: 'image-container',
        child: $container
      }));
      for (let name in images) {
        initCard(images[name], user, $container);
      }
    }

    function initCard(image, user, $container) {
      let html = mustache.render(image, user);
      let $img = tag('div', {
        innerHTML: html
      });
      ajax({
          url: '/profile/' + user.id,
          responseType: 'blob'
        })
        .then(res => {
          if (res) {
            return toDataURL(res)
          } else {
            return Promise.reject();
          }
        })
        .then(res => {
          const $profile = $img.get('.profile-picture');
          if ($profile) $profile.href.baseVal = res;
          const svg = svgToDataUrl($img.innerHTML);
          $img = tag('img', {
            src: svg
          });
          $container.append($img);
        });
    }
  }
}

function getTemplates() {
  return ajax({
    url: '/template/' + defaultTemplate
  })
}

export default Home;