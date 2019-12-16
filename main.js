const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const fileType = require('file-type');
const rmdir = require('rimraf');

const validate = require('./server/utils/validate');
const addTemplate = require('./server/addTemplate');
const scsstocss = require('./server/utils/SCSStoCSS');

dotenv.config();

const app = express();
const con = mysql.createConnection({
    user: process.env.dbuser,
    password: process.env.password,
    host: process.env.host,
    database: process.env.database
});


con.connect((err) => {
    if (err) {
        console.log(err);
        process.exit();
    }

    console.log('connected to database');
});

app.use(express.json({
    limit: '50mb'
}));
app.set('view engine', 'hbs');

// Routings

app.get('/style/:filename', (req, res) => {
    const url = path.join(__dirname, 'styles/') + req.params.filename.replace('css', 'scss');
    scsstocss(url, res);
});

app.get('/js/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/build/js/', req.params.filename));
});

app.get('/profile/:id', (req, res) => {
    const url = path.join(__dirname, 'res/images/profiles', req.params.id);
    const dflt = path.join(__dirname, 'res/images/profiles', 'default.png');

    fs.readFile(url, (err, buff) => {
        if (err) {
            return res.sendFile(dflt);
        }
        const type = fileType(buff);
        res.setHeader('Content-Type', type.mime);
        res.sendFile(url);
    });
});

app.post('/template', addTemplate);

app.get('/template/:id/:image?', (req, res) => {
    validate(req, res, success, error);

    function success() {
        const {
            id,
            image
        } = req.params;
        const dir = path.resolve(__dirname, './res/images/templates/', id);

        if (image) return res.sendFile(path.resolve(dir, image));

        fs.readdir(dir, (err, files) => {
            if (err) return error(err);

            const result = {};
            for (let file of files) {
                result[file] = fs.readFileSync(path.resolve(dir, file), 'utf-8');
            }

            res.send({
                status: 'ok',
                result
            });
        });
    }

    function error(err) {
        console.log(err);
        res.status(500).send(err.toString());
    }
});

app.get('/data', (req, res) => {
    validate(req, res, success, error);

    function success(user) {
        const {
            name,
            branch,
            batch,
            type
        } = req.query;

        if (!name || !branch) return res.send({
            status: 'error',
            error: 'Please fill all required feilds'
        });

        let query = 'select * from students where lower( name ) like ? and lower( branch ) like ?';
        if (batch) {
            query += ' and lower( batch ) like ?';
        }
        const params = [wild(name), wild(branch), wild(batch)];
        con.query(query, params, (err, result) => {
            if (err) return error(err);

            res.send({
                status: 'ok',
                result
            });
        });
    }

    /**
     * 
     * @param {string} str 
     */
    function wild(str) {
        return '%' + str.toLowerCase().split('').join('%') + '%';
    }

    function error(err) {
        console.log(err);
        res.status(500).send(err.toString());
    }
});

app.delete('/template/:id', (req, res) => {
    validate(req, res, success, error);

    function success(user) {
        const template = path.resolve(__dirname, './res/images/templates/', req.params.id);
        if (fs.existsSync(template)) {
            rmdir(template, ondelete);
        } else {
            res.send({
                status: 'error',
                error: 'Template does not exists'
            });
        }

    }

    function ondelete(err) {
        if (err) {
            console.log(err);
            return res.send({
                status: 'error',
                error: err.message
            });
        }

        res.send({
            status: 'ok',
            msg: 'Template deleted successfuly'
        });
    }

    function error(err) {
        console.log(err);
        res.status(500).send(err.toString());
    }
});

app.get('/templates', (req, res) => {
    const images = path.resolve(__dirname, './res/images/templates/');
    const templates = {};
    validate(req, res, success, error);

    function success(user) {
        fs.readdir(images, (err, files) => {
            if (err) return error(err);
            files.map(file => {
                templates[file] = fs.readdirSync(images + '/' + file);
            });
            res.send({
                status: 'ok',
                templates
            });
        })
    }

    function error(err) {
        console.log(err);
        res.status(500).send(err.toString());
    }
});

app.get('*', (req, res) => {
    res.render('index');
});

app.listen(8008, () => {
    console.log('Listening at 8008');
});