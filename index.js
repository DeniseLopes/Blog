
const path = require('path')
const { config, engine } = require('express-edge');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");

const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');


const app = new express();

mongoose.connect('mongodb://localhost:27017/blog-nodejs', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

app.use(fileUpload());
app.use(express.static('public'));
// Configure Edge if need to
config({ cache: process.env.NODE_ENV === 'production' });
// Automatically sets view engine and adds dot notation to app.render
app.use(engine);
app.set('views', `${__dirname}/views`);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

 const storePost = require('./middleware/storePost')
 app.use('/newpost1', storePost)

app.get('/', homePageController);
app.get('/newpost',createPostController)
app.post("/newpost1",storePostController);
app.get("/post:id", getPostController);
app.get("/register", createUserController);
app.post("/register", storeUserController);

app.get('/about', (req, res) => {
    res.render('about')
});
app.get('/contact', (req, res) => {
    res.render('contact')
});
app.get('/post', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/post.html'));
});




app.listen(4000, () => {
    console.log('App listening on port 4000')
});
