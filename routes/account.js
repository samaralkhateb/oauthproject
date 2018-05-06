var express = require('express');
var router = express.Router();

/* GET photo page. */
router.get('/', function(req, res, next) {
  res.render('account', { title: 'account' });
});


module.exports = router;
