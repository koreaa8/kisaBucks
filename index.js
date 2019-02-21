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

var accessKey = "8fd73197-6356-45b7-b197-a219e9ae034b";//user의 accessKey로 받아야함. 동적 할당
var refreash = "189cce5d-65c7-4daf-b6a5-3835626b3a0c";
var userNum = "1100034731";//회원의 userNum으로 로그인


//main page
app.get('/', function (req, res) {
    res.send("index");
});

app.post('/logincheck',function(req,res){
    var id = req.body.userID;
    var pw = req.body.password;
    console.log(id, pw)
    dbconn.pool.getConnection(function(err,conn){
        if(err){
            console.error(err)
            throw err
        }
        else{
            conn.query("SELECT * FROM user WHERE user_id=?",[id], 
            function(error, results, fields){
                if (error){ 
                    throw error;
                }
                else{
                    console.log(results)
                    if(results.length > 0) {
                        if(results[0].user_pw == pw) {
                            console.log("성공")
                            res.json(1);
                        } else {
                            res.send({
                                "code": 204,
                                "success": "Email and password does not match"
                            });
                        }
                    } else {
                        res.send({
                            "code":204,
                            "success": "Email does not exists"
                        });
                    }
                }    
            }) 
     
                
                }
            })
        }
);

//login
app.get('/login', function(req,res){
    res.render('login');
});

app.get('/payment', function(req,res){
    res.render('payment');
});


//signup
app.get('/signup', function (req, res) {

});

//cafe detail
app.get('/detail/cafe/:number', function (req, res) {
    var sql = 'select * from cafe where cid = ?'
    dbconn.pool.getConnection(function (err, conn) {
        if (err) {
            console.error(err);
            throw err;
        } else {
            conn.query(sql, [req.params.number], function (err, result, fields) {
                
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
app.post('/withdraw', function (req, res) {
    // 결제 금액을 변수 값에 저장하고 있다가 출금이체 API를 통해 잔액을 그 값을 변수에 넣어서 빼주고 나머지 값을 DB에 저장하는식
    console.log("/withdraw 에 들어왔음");
    var getUserDataURI = 'https://testapi.open-platform.or.kr/transfer/withdraw'; // 토큰을 받을 수 있는 restful url
    var options = {
        url: getUserDataURI,
        json : true,
        method : 'POST',
        headers: {
            'Content-Type' : 'application/json; charset=UTF-8',
            'Authorization' : 'Bearer '+accessKey
        },
        body : {
            dps_print_content : '통장기재내용',//금결원의 내용과 똑같아야함
            fintech_use_num : '199003892057724727972231', //조회하고자 하는 fintech_use_num을 입력
            print_content : '통장기재내용',
            tran_amt : 1000,// 출금금액
            tran_dtime : '20190219131000'
        }
    };
    request(options, function (err, response, body) {
        if(err){
            console.error(err);
            throw err;
        }
        else {
        
        console.log(body);
        }
    })
});
//기본적인 url..? 포맷 넣어놨고 필요에 따라 추가하시면 될 것 같아요!

var server = app.listen(3000, function () {
    console.log("Express server has started on port 3000")
});