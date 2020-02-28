
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

app.get('/', (req, res) => {
    res.redirect('/api/login');
});  

/// LOGIN REQUIRED ///
function requireLogin(req, res, next) {
    if (req.session && req.session.users) {
        console.log('user is logged in')
        next();
    } else {
        console.log('user is not logged in')
        res.redirect('/login');
    }
};


/// LOGIN  ///
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

/// SIGNUP ///

app.post('/api/signup', parseForm, parseJson, async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    try {
        const searchForUser = await user.getByEmail(email);
        console.log(searchForUser)
        console.log("success is false")
        res.json({
            success: false,
            user_taken: true
        });
    
    } catch (err) { 
        const newUserId = await user.signUp(email, password, first_name, last_name);

        console.log(newUserId);

        if (newUserId.id > 0) {
            console.log(`yay! you signed up!`);
                res.json({
                    success: true
                });
        } 
    }
});

//wine/wineID


/// HOME ///

/// LOGOUT ///
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

/// REDIRECT WHEN WRONG URL ////
app.get('*', (req, res) => {
    console.log("Redirecting, because no page here.");
    res.redirect('/home');
})


/// PORT LISTENING ////
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});