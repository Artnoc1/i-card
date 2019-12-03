const path = require('path');
const express = require('express');
const mysql = require('mysql');
const fs = require('fs');

const scsstocss = require('./utils/SCSStoCSS');

const app = express();
const con = mysql.createConnection({
    user: 'root',
    password: '',
    database: 'icard'
});

con.connect((err) => {
    if (err) {
        console.log(err);
        process.exit();
    }

    console.log('connected to database');
});

app.use(express.static(path.resolve(__dirname, 'public')));
app.set('view engine', 'hbs');
app.get('/style/:filename', (req, res) => {
    const url = path.join(__dirname, 'styles/') + req.params.filename.replace('css', 'scss');
    scsstocss(url, res);
});

app.get('/add', (req, res) => {
    const {
        id,
        name,
        branch,
        dob,
        batch
    } = req.query;

    const query = 'insert into students values(?,?,?,"",?,?)';
    con.query(query, [name, branch, dob, batch, id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        res.location('back').sendStatus(301);
    });
});

app.get('/getdata', (req, res) => {
    let query = 'select * from students';
    let params = [];

    if (req.query.id) {
        query += ' where id=?';
        params = [req.query.id];
    }

    con.query(query, params, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        res.send(result);
    });
});

app.get('/image/:name', (req, res) => {
    fs.readFile(path.join(__dirname, 'res', 'images', req.params.name), 'utf-8', (err, data) => {
        if (err) return console.log(err);
        res.send(data);
    });
});

app.get('/profile/:id', (req, res) => {
    const url = path.join(__dirname, 'res', 'images', req.params.id);
    const deflt = path.join(__dirname, 'res', 'images', 'default.png');
    if (fs.existsSync(url)) {
        res.sendFile(url);
    } else {
        res.sendFile(deflt);
    }
});

app.get('/', (req, res) => {
    con.query('select * from students', function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        res.render('index', {
            data: result
        });
    });
});

app.listen(8008, () => {
    console.log('Listening at 8008');
});