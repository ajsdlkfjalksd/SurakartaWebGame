topwide=100;
betwide=55;
var winflag=false;
var po=[];
biao1x=[0,1,2,3,4,5,4,4,4,4,4,4,5,4,3,2,1,0,1,1,1,1,1,1];
biao1y=[1,1,1,1,1,1,0,1,2,3,4,5,4,4,4,4,4,4,5,4,3,2,1,0];
biao2x=[0,1,2,3,4,5,3,3,3,3,3,3,5,4,3,2,1,0,2,2,2,2,2,2];
biao2y=[2,2,2,2,2,2,0,1,2,3,4,5,3,3,3,3,3,3,5,4,3,2,1,0];
corner=[0,5,6,11,12,17,18,23];
var AGE=[],x,y;
var socket = io.connect();
var moveflag;
var mx,my,mn;

var roomname;
var turn;
var yourturn;

function draw(){
    document.getElementById('btn-back-home').style.display="none";
    document.getElementById('map').style.display="";
    document.getElementById('stop').style.display="";
    document.getElementById('gs').style.display="";
    if(yourturn===1)
        document.getElementById('green').style.display="";
    else
        document.getElementById('blue').style.display="";
    var i,j;
    for(i=0; i<6; i++){
        po.push([]);
        for(j=0;j<6;j++){
            document.getElementById("drawbox").innerHTML += '<div class="ge" draggable="false" id="zi'+(i*6+j)+'" style="margin-top:10%; top: '+(topwide + i * betwide)+'px; left: '+(topwide + j * betwide)+'px;" ondrop="drop(event)" ondragover="allowDrop(event)"></div>';
            if(i<2) {
                document.getElementById('zi'+(i*6+j)).innerHTML += '<img id="'+(i*6+j)+'" src="../img/blue.svg" ondragstart="drag(event)" width="40" height="40" draggable="false" ondragover="allowDrop(event)">';
                po[i].push((i*6+j));
            }
            else if(i>3){
                document.getElementById('zi'+(i*6+j)).innerHTML += '<img id="'+(i*6+j)+'" src="../img/green.svg" ondragstart="drag(event)" width="40" height="40" draggable="true" ondragover="allowDrop(event)">';
                po[i].push((i*6+j));
            }
            else po[i].push('none');
        }
    }
}

function drag(ev) {
    if(turn%2===yourturn) {
        checkAvailable(Number(ev.target.id));
        ev.dataTransfer.setData("text", ev.target.id);
    }
}

function unlock() {
    if(turn%2===1){
        for(i=0; i<6; i++) {
            for (j = 0; j < 6; j++) {
                if(i<2 && document.getElementById(i*6+j)!== null)
                    document.getElementById(i*6+j).setAttribute("draggable","false");
                else if(i>3 && document.getElementById(i*6+j)!== null)
                    document.getElementById(i*6+j).setAttribute("draggable","true");
            }
        }
    }
    else{
        for(i=0; i<6; i++) {
            for (j = 0; j < 6; j++) {
                if(i<2 && document.getElementById(i*6+j)!== null)
                    document.getElementById(i*6+j).setAttribute("draggable","true");
                else if(i>3 && document.getElementById(i*6+j)!== null)
                    document.getElementById(i*6+j).setAttribute("draggable","false");
            }
        }
    }
}

function checkAvailable(posid) {
    clearAll();
    var color=checkColor(posid);
    var i,j,flag=false;
    for(x=0;x<6;x++){
        for(y=0;y<6;y++){
            if(po[y][x]===posid){
                flag=true;
                break;
            }
        }
        if(flag)
            break;
    }
    //MOVE
    if(x-1>=0 && y-1>=0)
        if(po[y-1][x-1]==='none') {
            changetoAvailable(x - 1 + (y - 1) * 6);
            console.log('lu');
        }
    if(x>=0 && y-1>=0)
        if(po[y-1][x]==='none') {
            changetoAvailable(x + (y - 1) * 6);
            console.log('u');
        }
    if(x+1<6 && y-1>=0)
        if(po[y-1][x+1]==='none'){
            changetoAvailable(x+1 + (y-1) * 6);
            console.log('ru');
        }
    if(x-1>=0)
        if(po[y][x-1]==='none') {
            changetoAvailable(x - 1 + y * 6);
            console.log('lm');
        }
    if(x+1<6)
        if(po[y][x+1]==='none'){
            changetoAvailable(x+1 + y * 6);
            console.log('rm');
        }
    if(x-1>=0 && y+1<6)
        if(po[y+1][x-1]==='none'){
            changetoAvailable(x-1 + (y+1) * 6);
            console.log('ld');
        }
    if(x>=0 && y+1<6)
        if(po[y+1][x]==='none'){
            changetoAvailable(x + (y+1) * 6);
            console.log('d');
        }
    if(x+1<6 && y+1<6)
        if(po[y+1][x+1]==='none'){
            changetoAvailable(x+1 + (y+1) * 6);
            console.log('rd');
        }
    //EAT
    var count=0,pp=[];
    for(i=0;i<24;i++)
        if(biao1x[i]===x && biao1y[i]===y) {
            count += 1;
            pp.push(i);
        }
    var cornerflag,goon;
    for(i=0;i<count;i++){
        cornerflag=false;
        goon=true;
        for(j=pp[i]+1;j<24;j++){
            if(po[biao1y[j]][biao1x[j]]!=='none'){
                if(cornerflag && checkColor(po[biao1y[j]][biao1x[j]])!==color)
                    changetoAvailable(biao1x[j] + biao1y[j] * 6);
                goon=false;
                break;
            }
            if(checkCorner(j)) cornerflag=true;
        }
        if(goon)
            for(j=0;j<pp[i];j++){
                if(po[biao1y[j]][biao1x[j]]!=='none'){
                    if(checkColor(po[biao1y[j]][biao1x[j]])!==color)
                        changetoAvailable(biao1x[j] + biao1y[j] * 6);
                    break;
                }
            }
        cornerflag=false;
        goon=true;
        for(j=pp[i]-1;j>0;j--){
            if(po[biao1y[j]][biao1x[j]]!=='none'){
                if(cornerflag && checkColor(po[biao1y[j]][biao1x[j]])!==color)
                    changetoAvailable(biao1x[j] + biao1y[j] * 6);
                goon=false;
                break;
            }
            if(checkCorner(j)) cornerflag=true;
        }
        if(goon)
            for(j=23;j>pp[i];j--){
                if(po[biao1y[j]][biao1x[j]]!=='none'){
                    if(checkColor(po[biao1y[j]][biao1x[j]])!==color)
                        changetoAvailable(biao1x[j] + biao1y[j] * 6);
                    break;
                }
            }
    }
    count=0;pp=[];
    for(i=0;i<24;i++)
        if(biao2x[i]===x && biao2y[i]===y) {
            count += 1;
            pp.push(i);
        }
    for(i=0;i<count;i++){
        cornerflag=false;
        goon=true;
        for(j=pp[i]+1;j<24;j++){
            if(po[biao2y[j]][biao2x[j]]!=='none'){
                //console.log(checkColor(po[biao2y[j]][biao2x[j]])+', '+color);
                if(cornerflag && checkColor(po[biao2y[j]][biao2x[j]])!==color)
                    changetoAvailable(biao2x[j] + biao2y[j] * 6);
                goon=false;
                break;
            }
            if(checkCorner(j)) cornerflag=true;
        }
        if(goon)
            for(j=0;j<pp[i];j++){
                if(po[biao2y[j]][biao2x[j]]!=='none'){
                    if(checkColor(po[biao2y[j]][biao2x[j]])!==color)
                        changetoAvailable(biao2x[j] + biao2y[j] * 6);
                    break;
                }
            }
        cornerflag=false;
        goon=true;
        for(j=pp[i]-1;j>0;j--){
            if(po[biao2y[j]][biao2x[j]]!=='none'){
                //console.log(checkColor(po[biao2y[j]][biao2x[j]])+', '+color);
                if(cornerflag && checkColor(po[biao2y[j]][biao2x[j]])!==color)
                    changetoAvailable(biao2x[j] + biao2y[j] * 6);
                goon=false;
                break;
            }
            if(checkCorner(j)) cornerflag=true;
        }
        if(goon)
            for(j=23;j>pp[i];j--){
                if(po[biao2y[j]][biao2x[j]]!=='none'){
                    if(checkColor(po[biao2y[j]][biao2x[j]])!==color)
                        changetoAvailable(biao2x[j] + biao2y[j] * 6);
                    break;
                }
            }
    }
}

function changetoAvailable(posid) {
    document.getElementById('zi' + posid).className = "age";
    AGE.push('zi'+posid);
}

function checkCorner(posid){
    var i;
    for(i=0;i<8;i++)
        if(corner[i]===posid) return true;
    return false;
}

function checkAGE(posid){
    var i;
    for(i=0;i<AGE.length;i++)
        if(AGE[i]===posid) return true;
    return false;
}

function clearAll(){
    var i;
    AGE=[];
    for(i=0;i<36;i++){
        document.getElementById('zi' + i).className = "ge";
    }
}

function checkColor(posid){
    if(posid<12) return 'blue';
    return 'green';
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    console.log(turn);
    if(turn%2===yourturn) {
        printPO();
        var ppp = ev.target;
        var flag = false;
        if (ppp.id.slice(0, 2) !== 'zi') {
            ppp = ppp.parentNode;
            flag = true;
        }
        if (checkAGE(ppp.id)) {
            ev.preventDefault();
            if (flag)
                ppp.removeChild(ppp.firstChild);
            var data = ev.dataTransfer.getData("text");
            po[y][x] = 'none';
            ppp.appendChild(document.getElementById(data));
            clearAll();
            var num = Number(ppp.id.slice(2));
            po[parseInt(num / 6)][num % 6] = Number(data);
            moveflag=false;
            socket.emit('movex', x);
            socket.emit('movey', y);
            socket.emit('moven', num);
            turn+=1;
            checkWin();
        }
    }
}

function movezi() {
    if(moveflag) {
        po[my][mx] = 'none';
        var ppp = document.getElementById('zi' + (my * 6 + mx));
        console.log(my,' ',mx,' ','zi' + (my * 6 + mx));
        var tppp = ppp.firstChild;
        po[parseInt(mn / 6)][mn % 6] = Number(tppp.id);
        ppp.removeChild(ppp.firstChild);
        ppp = document.getElementById('zi' + mn);
        if(ppp.firstChild!=null)
            ppp.removeChild(ppp.firstChild);
        ppp.appendChild(tppp);
        turn += 1;
    }
    unlock();
    moveflag=true;
}

function printPO() {
    var i,j,string;
    for(i=0;i<6;i++) {
        string = '';
        for (j = 0; j < 6; j++)
            string += po[i][j] + ', ';
        console.log(string);
    }
}

function show(){
    document.getElementById('map').style.display="";
    document.getElementById('inputf').style.display="none";
    document.getElementById('messages').style.display="none";
}

function checkWin(){
    var i;
    if(yourturn===1){
        for(i=0;i<18;i++){
            if(document.getElementById(i)!==null) return;
        }
    }
    else{
        for(i=18;i<36;i++){
            if(document.getElementById(i)!==null) return;
        }
    }
    socket.emit('iwin','');
    winflag=false;
    $('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
    $('.modal-alert .modal-header h4').text('You Win!');
    $('.modal-alert .modal-body p').html('Congratulations! You win!');
    $('.modal-alert').modal('show');
    $('.modal-alert button').click(function(){window.location.href = '/game';});
}

function lost() {
    winflag=false;
    $('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
    $('.modal-alert .modal-header h4').text('You Lost');
    $('.modal-alert .modal-body p').html('You lost.');
    $('.modal-alert').modal('show');
    $('.modal-alert button').click(function(){window.location.href = '/game';});
    socket.emit('ilost','');
}

function showAlert(t, m)
{
    $('.modal-alert .modal-header h4').text(t);
    $('.modal-alert .modal-body').html(m);
    $('.modal-alert').modal('show');
}

var rooms=[];

$(function () {
    $('form').submit(function () {
        socket.emit('create', $('#m').val());
        console.log('sent: '+$('#m').val());
        roomname=$('#m').val();
        $('#m').val('');
        return false;
    });
    socket.on('print',function(msg){
        $('#messages').append($('<li>').attr('id', msg).text(msg));
        rooms[roomname]=1;
    });
    socket.on('show',function(msg){
        console.log('get show');
        yourturn=parseInt(msg);
        show();
    });
    socket.on('start',function(){
        turn=1;
        moveflag=true;
        winflag=true;
        draw();
    });
    socket.on('alarm',function(){
        showAlert('Whoops!','The name of the room has been used. Please use a new name to create a new room.')
    });
    socket.on('mx',function (msg) {
        mx=parseInt(msg);
    });
    socket.on('my',function (msg) {
        my=parseInt(msg);
    });
    socket.on('mn',function (msg) {
        mn=parseInt(msg);
        movezi();
    });
    socket.on('full',function (msg) {
        if(msg in rooms){
            $('#'.msg).remove();
            delete[rooms[msg]];
        }
    });
    socket.on('youlost',function () {
        console.log('i lost')
        if(winflag){
            $('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
            $('.modal-alert .modal-header h4').text('You Lost');
            $('.modal-alert .modal-body p').html('Unfortunately, you lost.');
            $('.modal-alert').modal('show');
            $('.modal-alert button').click(function(){window.location.href = '/game';});
            socket.emit('ilost','');
            winflag=false;
        }
    });
    socket.on('youwin',function () {
        console.log('i win')
        if(winflag){
            $('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
            $('.modal-alert .modal-header h4').text('You Win');
            $('.modal-alert .modal-body p').html('Congratulations! You win!');
            $('.modal-alert').modal('show');
            $('.modal-alert button').click(function(){window.location.href = '/game';});
            socket.emit('iwin','');
            winflag=false;
        }
    });
});