
const http = require('http');
const express = require('express');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'public/images'});

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
app.use(express.static('public'));
const FileStore = require('session-file-store')(session);
const cors = require('cors');
app.use(cors({
    origin: ['*'],
    methods: ['*'],
    credentials: true
}))
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
        res.json({
            success: false
        });
    }
};

/////////////////       USER SECTION       /////////////////

/// LOGIN  ///
app.post('/api/login', parseForm, parseJson, async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    const didLoginSuccessfully = await user.login(email, password);
    console.log(didLoginSuccessfully)
    if (didLoginSuccessfully) {
        console.log(`the user has logged in!`);

        const u = await user.getByEmail(email);
        req.session.users = {
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


/// PROFILE ///

app.get('/api/profile', requireLogin, async (req, res) => {
    const id = req.session.users.id
    const userProfile = await user.getUser(id);
    res.json({success: userProfile});

})

/// PROFILE EDIT ////  ???????
app.post('/profile/edit', requireLogin, parseForm, async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    const id = req.session.user_id
    const result = await user.updateUserData(id, email, password, first_name, last_name);
    console.log(result)
    console.log("received profile edit")
    if (result) {
        res.json({profile: userProfile});
    } else {
        res.json({profile: userProfile})
    }
});


///////////////////      WINE SECTION        ///////////////

/// SEARCH FOR WINES /// 
app.post('/api/mysearch', requireLogin, parseForm, parseJson, async (req, res) => {
    const id = req.session.users.id;
    const {searchText} = req.body;
    try {
        const MyWineSearch = await wine.searchWinesByUserId(id, searchText)
        res.json({
            wineSearch: MyWineSearch
        });  
    } catch (err) {
        res.json({
            wineSearch: MyWineSearch
        });  
    }
});


app.post('/api/search', requireLogin, parseForm, parseJson, async (req, res) => {
    // const id = req.session.users.id;
    const {searchText} = req.body;
    try {
        const wineSearch = await wine.searchWines(searchText)
        res.json({
            wineSearch: wineSearch
        });  
    } catch (err) {
        res.json({
            wineSearch: wineSearch
        });  
    }
});



/// GET ALL WINES ///
app.get('/api/wines', requireLogin, async (req, res) => {
    console.log(req.session.users.id)
    const allWines = await wine.allWines();

    const wines = [];
    for (let wine of allWines) {
        wines.push(wine); 
    }
    res.json({wineList: wines});
})

/// GET WINES BY ID ///
app.get('/api/wines/:id(\\d+)/', requireLogin, async (req, res) => {
    const wineById = await wine.getWinesByID(req.params.id);
    res.json({wineList: wineById});
})

/// GET WINES BY USER ID ///
app.get('/api/mywines', requireLogin, async (req, res) => {
    const id = req.session.users.id;
    const winesById = await wine.getWinesByUserID(id);
    console.log(winesById)
    const myWines = [];
    for (let wine of winesById) {
        myWines.push(wine);
    }
    res.json({wineList: myWines});
})

/// GET FAVORITE WINES BY USER ID ///
app.get('/api/favorites', requireLogin, async (req, res) => {
    const id = req.session.users.id;
    const favById = await wine.favoriteWinesByUser(id)
    const myFavWines = [];
    for (let wine of favById) {
        myFavWines.push(wine);
    }
    res.json({wineList: myFavWines});
})


/// ADD FAVORITE WINES TO FAVORITES ////


app.post('/api/addtofavorites', requireLogin, parseForm, parseJson, async (req, res) => {
    console.log(req.body)
    const id = req.session.users.id;
    const { wine_id } = req.body;
    try {
        const addFavs = await wine.addWinesToFavorite(id, wine_id);
        res.json({
            addedWineFavs: true
        });  
    } catch (err) {
        res.json({
            addedWineFavs: false
        });  
    }
})



/// ADD A NEW WINE /// 
app.post('/api/wines/create', requireLogin, upload.single('wine_label'), parseForm, parseJson, async (req, res) => {
    console.log(req.session.users.id)
    const id = req.session.users.id;
    const { wine_name, wine_type, wine_price, wine_store, comments, wine_rating } = req.body;
    const wine_label = req.file.filename;
    const addNewWineId = await wine.addWine(wine_name, wine_type, wine_price, wine_store, wine_label, comments, wine_rating, id);
    if (addNewWineId) {
        res.json({success: addNewWineId})
    }
})

/// EDIT A WINE ///


app.post('/api/editwines', requireLogin, upload.single('wine_label'), parseForm, parseJson, async (req, res) => {
    console.log(req.body)

    const { id, wine_name, wine_type, wine_price, wine_store, comments, wine_rating } = req.body;
    console.log(req.body.wine_label)

    const wine_label = req.file.filename;
    if (wine_label) {
        const updateWine = await wine.updateWine(id, wine_name, wine_type, wine_price, wine_store, wine_label, comments, wine_rating);

    if (updateWine) {
        res.json({success: true})
    } else {
        res.json({success: false})
    }
    } else {
        const updateWine = await wine.updateWineWOImage(id, wine_name, wine_type, wine_price, wine_store, comments, wine_rating);

        if (updateWine) {
            res.json({success: true})
        } else {
            res.json({success: false})
        }
        
    }

    // const wine_label = req.file.filename;
    
});



/// DELETE A WINE ///
// app.get('/wines/:id/delete')

app.post('/api/delete', requireLogin, parseForm, parseJson, async (req, res) => {
    const { wine_id } = req.body;

    try {
        const deleteWine = await wine.deleteWine(wine_id);
        console.log(deleteWine)
        if (deleteWine.rowCount === 1) {
            res.json({
                deletedWine: true
            });  
        } else {
            res.json({
                deletedWine: false
            }); 
        }

    } catch (err) {
        console.log(err)
        res.json({
            deletedWine: false
        });  
    }
})

/// DELETE FAV WINE BY USER ////
app.post('/api/deletefavwine', requireLogin, parseForm, parseJson, async (req, res) => {
    const id = req.session.users.id;
    const { wine_id } = req.body;

    try {
        const deleteFavWine = await wine.deleteFavWine(wine_id, id);
        res.json({
            deletedWine: true
        });  
    } catch (err) {
        res.json({
            deletedWine: false
        });  
    }
})



/// LOGOUT ///
app.get('/api/logout', (req, res) => {
    console.log('logging out')
    req.session.destroy(() => {
        console.log('user logged out')
        res.json({
            isLoggedOut: true
        })

    });
});

// Handles any requests that don't match previous ones
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


/// PORT LISTENING ////
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});