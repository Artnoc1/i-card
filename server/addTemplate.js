const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const validate = require('./utils/validate');

function addTemplate(req, res) {
  const templates = path.resolve(__dirname, '../res/images/templates/');
  validate(req, res, success, error);

  function success(user) {
    const images = req.body.images;
    const length = Object.values(images).length;
    if (length === 0)
      return res.status(400).send('Please uploade images...');

    const templateId = crypto.randomBytes(4).toString('hex');
    const dir = templates + '/' + templateId;
    let counter = 0;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    for (let key in images) {
      fs.writeFile(`${dir}/${key}`, images[key], 'utf-8', err => {
        if (err) return error(err);
        if (++counter === length) res.send({
          status: 'ok',
          msg: 'file saved'
        })
      });
    }
  }

  function error(err) {
    console.log(err);
    res.status(500).send(err.toString());
  }
}

module.exports = addTemplate;