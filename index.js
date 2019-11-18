//DEPENDENCIAS
const connectFlash = require("connect-flash");
const path = require('path')
const edge = require("edge.js");
const { config, engine } = require('express-edge');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
//CONTROLLERS
const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');
const logoutController = require("./controllers/logout");
//MIDDLEWARE
const storePost = require('./middleware/storePost');
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated');
const auth = require("./middleware/auth");

const app = new express();

	
app.use(connectFlash());

app.use(expressSession({
    secret: 'secret'
}));

mongoose.connect('mongodb://localhost:27017/blog-nodejs', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

    const mongoStore = connectMongo(expressSession);
 
app.use(expressSession({
    secret: 'secret',
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(fileUpload());
app.use(express.static('public'));

// CONFIGURACAO DO EDGE
config({ cache: process.env.NODE_ENV === 'production' });
// Define automaticamente o mecanismo de exibição e adiciona notação do ponto ao app.render
app.use(engine);

app.set('views', `${__dirname}/views`);

app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/newpost1', storePost)

//ROTAS

app.get('/', homePageController);
app.get("/post:id", getPostController);
app.get('/newpost',auth,createPostController);
app.post("/newpost1",auth,storePostController);
app.get('/login',redirectIfAuthenticated,loginController);
app.post('/login1',redirectIfAuthenticated,loginUserController);
app.get("/register",redirectIfAuthenticated,createUserController);
app.post("/register",redirectIfAuthenticated,storeUserController);
app.get("/logout", redirectIfAuthenticated, logoutController);

//PORTA SERVIDOR
app.listen(4000, () => {
    console.log('App listening on port 4000')
});
