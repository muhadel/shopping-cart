var express = require('express');
var router = express.Router();


var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function (req, res, next) {
  var successMsg = req.flash('success')[0];
  var products = Product.find(function (err, docs) {
    var productChuncks = [];
    var chunckSize = 4;
    for (var i = 0; i < docs.length; i += chunckSize) {
      productChuncks.push(docs.slice(i, i + chunckSize));
    }
    // console.log('product-->', productChuncks);

    res.render('shop/index', { title: 'Express', gameProducts: docs, successMsg: successMsg, noMesssages: !successMsg });
  });

});
//i wana change the name of id
router.get('/add-to-card/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);

    res.redirect('/');
  });
});

router.get('/reduce/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice })
});



router.get('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];

  res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
});


router.post('/checkout', isLoggedIn, function (req, res, next) {

  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }

  var cart = new Cart(req.session.cart);
  var stripe = require("stripe")("sk_test_EmoPTTDozsJ7QkyjykZI5zw0");

  stripe.charges.create({
    amount: cart.totalPrice * 100, //cent
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge"
  }, function (err, charge) {
    // asynchronously called
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }

    //Store Order to DB
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });

    order.save(function (err, result) {
      if (err) {
        //do something
      }
      req.flash('success', 'Successfully bought product!');
      req.session.cart = null;
      res.redirect('/');

    })
  });
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}