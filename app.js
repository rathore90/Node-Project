const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { render } = require('ejs');
const blogRouters = require('./routes/blogRoutes')

// express app
const app = express();

// connection string
const dbURI = 'mongodb+srv://pardeep_node:44yxbBysXCgZ3bSn@cluster0.n66oq.mongodb.net/node-tuts?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
// this middleware is used for accepting form data
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

//  blog routes
app.use('/blogs', blogRouters);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
