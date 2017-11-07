const express = require('express');
const Site = require('../models/site');

const router = express.Router();

/* GET sites listing. */
router.get('/', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query = {};
  const sites = await Site.paginate(query, {
    sort: {name: 1},
    page: page, limit: limit
  });
  res.render('sites/index', {sites: sites});
});

router.get('/new', (req, res, next) => {
  res.render('sites/new', {site: {}});
});

router.get('/:includeLang', (req, res, next) => {
  res.render('sites/')
});

router.post('/', async (req, res, next) => {
  var site = new Site({
    name: req.body.name,
    domain: req.body.domain,
    includeLang: req.body.includeLang.split(" ").map(e => e.trim()),
    language: req.body.language.split(" ").map(e => e.trim()),
  });
  await site.save(function(err, site) {
    if (err) {
      return console.error(err);
    } else {
      console.dir(site);
    }
  });
  res.redirect('../sites');
});

module.exports = router;
