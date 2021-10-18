const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { render } = require('ejs');

// express app
const app = express();

// connection string
const dbURI = 'mongodb+srv://pardeep_node:44yxbBysXCgZ3bSn@cluster0.n66oq.mongodb.net/node-tuts?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// listen for requests
// app.listen(3000);

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
// this middleware is used for accepting form data
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'));

// app.get('/add-blog', (req, res) => {
//   const blog = new Blog({
//     title: 'new-blog2',
//     snippet: '2about my new blog',
//     body: '2more about my new blog'
//   });

//   blog.save()
//     .then((result) =>{
//       res.send(result)
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// })

// app.get('/all-blogs', (req,res)=>{
//   Blog.find()
//   .then((result) => {
//     res.send(result);
//   }).catch((err)=>{
//     console.log(err)
//   })
// })

// app.get('/single-blog', (req, res) => {
//   Blog.findById('616ce967bb25d6ad7c49608c')
//   .then((result) => {
//     res.send(result)
//   })
//   .catch((err) => {
//     console.log(err);
//   })
// })

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// blog route
app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
  .then((result) => {
    res.render('index', { title: 'AllBlogs', blogs: result})
  })
  .catch((err) => {
    console.log(err);
  })
})

app.post('/blogs', (req, res) => {
  const blog = new Blog(req.body);

  blog.save()
  .then((result) => {
    res.redirect('/blogs')
  }).catch((err) => {
    console.log(err);
  })
})

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
  .then((result) => {
    res.render('details', { blog: result, title: 'blog details' })
  }).catch((err) => {
    console.log(err);
  })
})

app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
  .then(result => {
    res.json({
      redirect: '/blogs'
    })
  }).catch((err) => {
    console.log(err);
  })
})

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
