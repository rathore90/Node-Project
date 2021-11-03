const Blog = require('../models/blog');
const axios = require('axios')
const PUBLISHER_KEY = 'pk_test_51HAQ8GHDkmXqGeZTqGsVbqI9Q3ulKvWNqiiLkceJO5cXHyulHyyk5A2VWbDX4dJDptC7248jaFrGGuXpz1Jr7W5P007aUoMX4O'
const SECRET_KEY = 'sk_test_51HAQ8GHDkmXqGeZTdMZBc1PnsjiYXNiGIcu4QT6PDa9kA2Fjhk6uTv8OlX4uhMs5vliZcdIOsV6YKfMGiNLEkSNl00vkJYFUnZ'

const stripe = require('stripe')(SECRET_KEY)

const blog_index = (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { 
        blogs: result, 
        title: 'All blogs', 
        key: PUBLISHER_KEY,   
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
      });
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_details = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      console.log(err);
      res.render('404', { title: 'Blog not found' });
    });
}

const blog_create_get = async (req, res) => {
  let data = {}

  console.log("tokennning ", req.oidc.accessToken);

  const {token_type, access_token} = req.oidc.accessToken;
  try{
    const apiResponse = await axios.get('http://localhost:8000/private',
    {
      headers: {
        authorization: `${token_type} ${access_token}`
      }
    });
    data = apiResponse.data;
  }catch(e){
    console.log(e);
  }
  res.render('create', {
    title: 'Create a new blog', 
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user,
    data: data
  });
}

const blog_create_post = (req, res) => {
  const blog = new Blog(req.body);
  blog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_delete = (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_payment = (req, res) => {
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken,
    name: 'Pardeep Rathore',
    address: {
      line1: '801 Fennel Road',
      postal_code: '110092',
      city: 'Kelowna',
      state: 'BC',
      country: 'Canada',
    }
  })
    .then((customer) => {

      return stripe.charges.create({
        amount: 7000,  
        description: 'Blog Development',
        currency: 'CAD',
        customer: customer.id
      });
    })
    .then((charge) => {
      res.render('payment_success', { title: 'Payment Success' }); // If no error occurs
    })
    .catch((err) => {
      res.send(err)    // If some error occurs 
    });
}

module.exports = {
  blog_index,
  blog_details,
  blog_create_get,
  blog_create_post,
  blog_delete,
  blog_payment
}