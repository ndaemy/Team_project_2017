const express = require('express');
const Site = require('../models/site');
const catchErrors = require('../lib/async-error');

const router = express.Router();

function needAuth(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else{
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

/* GET sites listing. */
router.get('/', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query = {};
  const lang = req.query.lang;
  const feat = req.query.feat;

  if (lang) {
    query = {'includeLang': lang};
  }
  if (feat) {
    query = {'feature': feat};
  }

  const sites = await Site.paginate(query, {
    sort: {name: 1},
    page: page, limit: limit
  });
  res.render('sites/index', {sites: sites});
});

router.get('/new', needAuth, (req, res, next) => {
  res.render('sites/new', {site: {}});
});

router.get('/:id', async (req, res, next) => {
  const site = await Site.findById(req.params.id);
  res.render('sites/detail', {site: site});
});

router.get('/:id/edit', needAuth, async (req, res, next) => {
  const site = await Site.findById(req.params.id);
  res.render('sites/edit', {site: site});
});

router.delete('/:id', needAuth, async (req, res, next) => {
  await Site.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/sites');
});

router.post('/', async (req, res, next) => {
  var site = new Site({
    name: req.body.name,
    domain: req.body.domain,
    includeLang: req.body.includeLang.toLowerCase().split(" ").map(e => e.trim()),
    language: req.body.language.toLowerCase().split(" ").map(e => e.trim()),
    feature: req.body.feature.toLowerCase().split(" ").map(e => e.trim())
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
