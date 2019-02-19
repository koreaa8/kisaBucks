var express = require('express');
var app = express();
var dbconn = require('./routes/database/database');
var request = require('request');
var appdata = require('./appdata.json');
var path = require('path');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

//main page
app.get('/', function (req, res) {
    res.send("index");
});

//login
app.get('/login', function (req, res) {

});

//signup
app.get('/signup', function (req, res) {

});

//cafe detail
app.get('/detail/cafe', function (req, res) {
    var sql = 'select * from cafe where cid = 2'
    dbconn.pool.getConnection(function (err, conn) {
        if (err) {
            console.error(err);
            throw err;
        } else {
            conn.query(sql, function (err, result, fields) {
                var cafeData = result[0];
                var cafeMenuData = JSON.parse(cafeData.cafe_menu);
                delete cafeData.cafe_menu;
                res.render('cafe-detail', {
                    data: cafeData,
                    menudata: cafeMenuData
                });
                conn.release();
            })
        }

    })

});

//payment detail 
app.get('/payment', function (req, res) {

});


//기본적인 url..? 포맷 넣어놨고 필요에 따라 추가하시면 될 것 같아요!

var server = app.listen(3000, function () {
    console.log("Express server has started on port 3000")
});