
const http = require('http');
const express = require('express');

// const multer = require('multer');
// const upload = multer({ dest: 'public/images'});

const app = express();
const PORT = 4000;

const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({
    extended: true
});

const parseJson = bodyParser.json();
const session = require('express-session');

const server = http.createServer(app);

const user = require('./models/user')
const wine = require('./models/wine')

// import axios from 'axios';

const FileStore = require('session-file-store')(session);
app.use(session({
    store: new FileStore({}),
    resave: true,
    saveUninitialized: false,
    // We will move this to a secure location, shortly.
    secret: 'lalala1234lalala'
}));

app.use((req, res, next) => {
    console.log('***********');
    console.log(req.session);
    console.log('***********');

    next();
});

// app.get('/', (req, res) => {
//     res.redirect('/login');
// });  

app.post('/api/login', parseForm, parseJson, async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    const didLoginSuccessfully = await user.login(email, password);
    console.log(didLoginSuccessfully)
    if (didLoginSuccessfully) {
        console.log(`the user has logged in!`);

        const u = await user.getByEmail(email);
        req.session.user = {
            email,
            id: u.id
        };
        req.session.save(() => {
            console.log('The session is now saved!!!');
            res.json({
                success: true
            });
        });
    } else {
        console.log(`Incorrect`);
        res.json({
            success: false
        });
    }
});


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});