var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('Trendings', { title: 'Trending Movies' });
});

module.exports = router;
