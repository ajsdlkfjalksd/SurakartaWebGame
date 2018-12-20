var express = require('express');
var app = express();
var http = require('http');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);


app.locals.pretty = true;
app.set('port', 80);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));

// build mongo database connection url //

var dbHost = 'localhost';
var dbPort = 27017;
var dbName = 'node-login';
var dbUser = 'nodelogin';
var dbPass = 'xyz123';

var dbURL = 'mongodb://'+dbUser+':'+dbPass+'@'+dbHost+':'+dbPort+'/'+dbName;

app.use(session({
        secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
        proxy: true,
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({ url: dbURL })
    })
);

require('./app/server/routes')(app);

var server = http.createServer(app);

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io')(server);

var room = [];
var inroom=[];

io.on('connection', function(socket){
    for(var name in room)
        if(room[name]===1)
            socket.emit('print',name);

    socket.on('create', function (roomname) {
        if(roomname in room) {
            if (room[roomname] === 1) {
                room[roomname]=2;
                socket.join(roomname);
                socket.emit('show', 0);
                inroom[socket.id]=roomname;
                io.sockets.in(roomname).emit('start');
                io.emit('full',roomname);
                console.log('player ',socket.id,' join room ',roomname);
            }
            else {
                socket.emit('alarm','');
            }
        }
        else {
            room[roomname] = 1;
            socket.join(roomname);
            socket.emit('show',1);
            io.emit('print', roomname);
            inroom[socket.id]=roomname;
            console.log('player ',socket.id,' create room ',roomname);
        }
    });

    socket.on('movex', function (msg) {
        io.sockets.in(inroom[socket.id]).emit('mx',msg);
    });
    socket.on('movey', function (msg) {
        io.sockets.in(inroom[socket.id]).emit('my',msg);
    });
    socket.on('moven', function (msg) {
        io.sockets.in(inroom[socket.id]).emit('mn',msg);
    });
    socket.on('iwin', function (msg) {
        io.sockets.in(inroom[socket.id]).emit('youlost',msg);
        socket.leave(inroom[socket.id]);
        delete room[inroom[socket.id]];
        delete inroom[socket.id];
    });
    socket.on('ilost', function (msg) {
        console.log('send win')
        io.sockets.in(inroom[socket.id]).emit('youwin',msg);
        socket.leave(inroom[socket.id]);
        delete inroom[socket.id];
    });
});

