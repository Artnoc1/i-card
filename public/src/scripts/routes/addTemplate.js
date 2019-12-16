import tag from 'html-tag-js';
import ajax from '@deadlyjack/ajax';
import Page from "../page";
import _template from '../../templates/addTemplate.hbs';
import parseDim from '../helpers/parseDim';
import getRatio from '../helpers/getRatio';
import Toast from '../helpers/toast';
import dialogs from '../helpers/dialogs';

function AddTemplate(state) {
  const page = new Page(_template, 'Add new Template', state);
  const $droparea = tag.get('#drop-area');
  const $text = $droparea.querySelector('.text');
  const $checklists = tag.get('#check-lists');
  const $images = tag.get('#images');
  const $save = tag.get('#save');
  const $clear = tag.get('#clear');
  const files = $images.files;

  $clear.addEventListener('click', function (e) {
    e.preventDefault();
    $checklists.innerHTML = '';
    const $images_ = tag.getAll('.image-container');
    [...$images_].map($img => {
      $img.remove();
    });
  });
  $save.addEventListener('click', function (e) {
    e.preventDefault();
    const images = {};
    const $images_ = tag.getAll('.image-container');
    [...$images_].map($img => {
      images[$img.getAttribute('data-name')] = $img.innerHTML;
    });
    ajax({
        url: '/template',
        contentType: 'application/json',
        data: {
          images
        },
        method: 'post',
        xhr: function (xhr) {
          let toast;
          xhr.upload.onloadstart = function (e) {
            toast = Toast('Uploading...', {
              type: 'success',
              progressbar: true
            });
          }
          xhr.upload.onloadend = function (e) {
            if (toast) toast.hide();
            Toast('Finished uploading...');
          }
          xhr.upload.onprogress = function (e) {
            const percent = Math.round((e.loaded / e.total) * 100);
            if (toast) toast.updateProgress(percent, `uploaded ${percent}%`);
          };
        }
      })
      .then(res => {
        if (res.status === 'ok') {
          Toast(res.msg, {
            type: 'success'
          });
        } else {
          Toast(err.error ? err.msg : 'Upload failed', {
            type: 'error'
          });
        }
      })
      .catch(err => {
        Toast(typeof err === 'string' ? err : 'Upload failed', {
          type: 'error'
        });
        console.log(err);
      });
  });
  $images.addEventListener('change', function (e) {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(this.files);
    this.files = files;
  });
  ['dragenter', 'dragleave', 'dragover', 'drop'].map(etype => {
    $droparea.addEventListener(etype, handleDrag, false);
  });

  /**
   * 
   * @param {DragEvent} e 
   */
  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    switch (e.type) {
      case 'dragenter':
        start();
        break;
      case 'dragleave':
        end();
        break;
      case 'drop':
        end();
        handleFiles(e.dataTransfer.files);
        break;
      default:
        console.log(e.type);
    }

    function start() {
      $droparea.classList.add('active');
      $text.textContent = 'Drop here!';
    }

    function end() {
      $droparea.classList.remove('active');
      $text.textContent = 'Upload files';
    }
  }

  /**
   * 
   * @param {FileList} files 
   */
  function handleFiles(files) {
    for (let i = 0; i < files.length; ++i) {
      const file = files[i];
      if (!/^image\/svg(\+xml)?$/.test(file.type)) continue;
      readFile(file);
    }
  }

  /**
   * 
   * @param {File} file 
   */
  function readFile(file) {
    const name = file.name;
    const fileReader = new FileReader();
    fileReader.onloadend = function (e) {
      printImage(name, e.target.result);
    }
    fileReader.readAsText(file, 'utf-8');
  }

  /**
   * 
   * @param {string} name 
   * @param {string} svg 
   */
  function printImage(name, svg) {
    const $container = tag('div', {
      className: 'image-container',
      innerHTML: svg,
      attr: {
        "data-name": name
      }
    });
    const $list = tag('ul', {
      className: 'check-list',
      attr: {
        "data-name": name
      }
    });
    const list = [];
    const ratio = getRatio('pt');

    /**
     * @type {SVGAElement}
     */
    const $svg = $container.get('svg');
    const width = parseDim($svg.getAttribute('width')).value * ratio;
    const height = parseDim($svg.getAttribute('height')).value * ratio;
    const cclient = $droparea.getBoundingClientRect();

    const _height = cclient.height - 50;
    const imageRatio = _height / height;
    const _width = width * imageRatio;

    $svg.onclick = function (e) {
      let el = e.target;
      if (el instanceof SVGUseElement) {
        el = document.getElementById(el.href.baseVal.substr(1));
      }
      dialogs.select('Select property', [
        ['profile-picture', 'profile picture'],
        'barcode',
        ['principal-sign', 'principal signature']
      ]).then(which => {
        if (list.indexOf(which) > -1) return;

        list.push(which);
        $list.innerHTML += `<li>${which}</li>`;

        el.classList.add(which);
      });
    }

    $svg.setAttribute('width', _width + 'px');
    $svg.setAttribute('height', _height + 'px');

    $droparea.append($container);
    $checklists.append($list);
  }

  return page;
}

export default AddTemplate;