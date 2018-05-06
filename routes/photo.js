var express = require('express');
var router = express.Router();
var amqp = require('amqplib/callback_api');
async = require("async");
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var fs = require('fs');
const _id = 1;


///////////////DATAT//
var mysql = require('mysql');

var connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tumblr1'
  }
);

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

///DTAT
/* GET photo page. */
router.get('/', function (req, res, next) {
  res.render('photo', { title: 'photo' });
});

/* Get All Photo page. */

router.get('/allphoto', function (req, res, next) {
  amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
      var q = 'show Photos';
      var msg = 'Push show message in queue';
      ch.assertQueue(q, { durable: false });
      ch.sendToQueue(q, new Buffer(msg));
      console.log(" [QUEUE] Sent %s", msg);
    });
    //res.redirect('/photo/receive');
    setTimeout(function () { conn.close(); }, 500);
  });
  var con = req.con;
  con.query('select * from photos',
    function (error, photos) {
      con.query('select * from users',
        function (error, user) {
          //res.end(JSON.stringify(rows));
          //var data = text ;
          var all = {
            photos: photos,
            user: user
          }
          res.render('photo', { all, _id ,R} );

        });

    });

});


/* Post Add Photo page. */


router.post('/addphoto', upload.any(), function (req, res, next) {
  ///////////////////////////////////////////////////////////////////
  amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
      var q = 'add Photos';
      var msg = 'Push Msg In Queue';
      ch.assertQueue(q, { durable: false });
      ch.sendToQueue(q, new Buffer(msg));
      console.log(" [QUEUE] Sent %s", msg);
    });
    setTimeout(function () { conn.close(); }, 500);
  });

  var con = req.con;

  connection.beginTransaction(function (err) {
    //if (err) { throw err; }
    connection.query('INSERT INTO names SET name=?', "dodo", function (err, result) {
      if (err) {
        connection.rollback(function () {
        //  throw err;
          console.log('rollback1');
        });
      }
      if (req.files) {
        req.files.forEach(function (file) {
          var filename = (new Date).valueOf() + "-" + file.originalname;
          fs.rename(file.path, 'public/images/' + filename, function (err) {
            //if (err) throw err;
            var d = new Date();
            con.query('insert into photos (image,date,user_id) values (?,?,?)',
              [filename, d, _id],
              function (err, photo) {
                if (err) {
                  con.rollback(function () {
                    //throw err;
                    console.log('rollback2');
                  });
                }
               

                con.commit(function (err) {
                  if (err) {
                    con.rollback(function () {
                      throw err;
                      console.log('rollback3');
                    });
                  }
                  
                  
                 // var data = { photos: photo };
                 // res.json(data);
                  
                  //connection.end();
                });

              });


          });
        });
      }
      res.redirect('/photo/allphoto');
    });
  });
  /* End transaction */
  /////

});



/* Delete Delete Photo page. */
router.get('/deletephoto/:id', function (req, res, next) {
  var id = req.params.id;
  var con = req.con;
  con.query('delete from photos where id = ?',
    [id],
    function (error, rows) {
      console.log('Don!');
      res.redirect('/photo/allphoto');


    });

});

/* Put Edit Photo page. */
router.post('/editphoto/:id', upload.any(), function (req, res, next) {
  var id = req.params.id;
  var con = req.con;
  if (req.files) {
    req.files.forEach(function (file) {
      var filename = (new Date).valueOf() + "-" + file.originalname;
      fs.rename(file.path, 'public/images/' + filename, function (err) {
        if (err) throw err;
        con.query('update photos set image=? where id = ?',
          [filename, id],
          function (error, rows) {
            if (error) { throw error; }
           //res.redirect('/photo/allphoto');
          });
      });
    });
    

  }
  
    res.redirect('/photo/allphoto');
  

});


router.get('/editim/:id', function (req, res, next) {
  var id = req.params.id;
  var con = req.con;
  con.query('select * from  photos  where id = ?',
    [id],
    function (error, image) {
      res.render('editimage', { image });
    });
});


module.exports = router;
