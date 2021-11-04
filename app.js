const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRouters = require('./routes/blogRoutes')
const { auth } = require('express-openid-connect');
require('dotenv').config();


const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL ,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUER,
  clientSecret: process.env.CLIENTSECRET,
  authorizationParams: {
    response_type: 'code',
    audience: 'http://localhost:8000',
    scope: 'openid profile email'
  }
};

// express app
const app = express();

// connection string
const dbURI = 'mongodb+srv://pardeep_node:44yxbBysXCgZ3bSn@cluster0.n66oq.mongodb.net/node-tuts?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => app.listen(process.env.PORT || 3000))
  .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
// this middleware is used for accepting form data
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'));
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// auth

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About', 
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user 
  });
});

// app.get('/', (req, res) => {
//   // res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
//   res.send('partials/nav', { isAuthenticated: req.oidc.isAuthenticated() })
// });

//  blog routes
app.use('/blogs', blogRouters);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
