var express = require('express');
var router = express.Router();
async = require("async");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', { title: 'HOME' });
});


/* GET getstart page. */
router.get('/getstart', function (req, res, next) {
  res.render('getstart', { title: 'getstart' });
});




/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'login' });
});

/* GET login page. */
router.get('/account', function (req, res, next) {
  res.render('account', { title: 'account' });
});


router.get('/test', function (req, res, next) {
  var con = req.con;
  async.parallel(
    [
      function (callback) {
        con.query('select * from account',
          function (errors, accounts) {
            callback(errors, accounts);
          });
      }
    ],
    function (err, results) {
      var data = { accounts: results };
      res.json(data);
      //res.render('account',data);
    }
  );
});
module.exports = router;
