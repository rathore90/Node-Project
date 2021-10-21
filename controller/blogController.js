const Blog = require('../models/blog');
const PUBLISHER_KEY = "pk_test_51GtSONETdjG0caU1urBtCRuAeA2KsB92MjUzkLQR8LhopftaXkW6EDW9N2Ax8Q9gMuldvYgRj4FPfPgIC1EGuUtm00D5sjnRNu"
const SECRET_KEY = "sk_test_51GtSONETdjG0caU1tLawSk3OAdAKzFHNlDZy0HEMUP4pluP8rFlyEM53LLCa2OyM1XioPKGf8klJcWIvtxwoHMih00HlWR2oUx"

const stripe = require('stripe')(SECRET_KEY)

const blog_index = (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs', key: PUBLISHER_KEY });
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

const blog_create_get = (req, res) => {
  res.render('create', { title: 'Create a new blog' });
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
  // Moreover you can take more details from user 
  // like Address, Name, etc from form 
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken,
    name: 'Gautam Sharma',
    address: {
      line1: 'TC 9/4 Old MES colony',
      postal_code: '110092',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
    }
  })
    .then((customer) => {

      return stripe.charges.create({
        amount: 7000,    // Charing Rs 25 
        description: 'Web Development Product',
        currency: 'USD',
        customer: customer.id
      });
    })
    .then((charge) => {
      res.render('payment_success', { title: 'Create a new blog' }); // If no error occurs
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