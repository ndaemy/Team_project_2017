var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/about', (req, res, next) => {
  res.render('about');
});

router.get('/help', (req, res, next) => {
  res.render('help');
});

router.get('/contact', (req, res, next) => {
  res.render('contact');
});

module.exports = router;
