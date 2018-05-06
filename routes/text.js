var express = require('express');
var router = express.Router();

var amqp = require('amqplib/callback_api');
async = require("async");
const _id = 1;
/* GET text page. */
router.get('/', function (req, res, next) {
  res.render('text', { title: 'Text' });
});

/* GET Read text page. */
router.get('/alltext', function (req, res, next) {
  //var id_u = 1;
  var con = req.con;
  con.query('select * from text',
    function (error, text) {
      con.query('select * from users',
        function (error, user) {
          //res.end(JSON.stringify(rows));
          //var data = text ;
          var all = {
            text: text,
            user: user
          }
          res.render('text', { all, _id });

        });

    });

});

/* Post Add text page. */
router.post('/addtext', function (req, res, next) {
  amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
      var q = 'add Text';
      var msg = 'Push Add Text Request In Queue';
      ch.assertQueue(q, { durable: false });
      ch.sendToQueue(q, new Buffer(msg));
      console.log(" [QUEUE] Sent %s", msg);
    });
    setTimeout(function () { conn.close(); }, 500);
  });
  var con = req.con;
  var d = new Date();
  con.query('insert into text (content,date,user_id) values (?,?,?)',
    [req.body.content,d, _id],
    function (error, rows) {
      if (error) { throw error; }
    });
  con.query('select * from text',
    function (error, text) {
      res.redirect('/text/alltext');
    });
});




/* Delete Delete text page. */
router.get('/deletetext/:id', function (req, res, next) {
  var id = req.params.id;
  var con = req.con;
  con.query('delete from text where id = ?',
    [id],
    function (error, rows) {
      //res.end(JSON.stringify(rows));
      console.log('Don!');
      res.redirect('/text/alltext');

    });

});


/* Put Edit text page. */
router.post('/edittext/:id', function (req, res, next) {
  var id = req.params.id;
  var con = req.con;
  con.query('update text set content=? where id = ?',
    [req.body.content, id],
    function (error, rows) {
      if (error) { throw error; }
      res.redirect('/text/alltext');
    });
});

router.get('/edit/:id', function (req, res, next) {
  var id = req.params.id;
  var con = req.con;
  con.query('select * from  text  where id = ?',
    [id],
    function (error, text) {
      /* var text = {
         text1 :text1
       }*/
      //res.json(text);     
      res.render('edit', { text });
    });
});

module.exports = router;

