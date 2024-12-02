var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('aboutUs', { title: 'About Us' });
});

module.exports = router;
