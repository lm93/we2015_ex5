var devicename; // the name of this screen and specified in the URL
var imageCount = 7; // the maximum number of images available
var socket = io(); //connect;
sequence = 0;
//todo keep track of connections


document.addEventListener("DOMContentLoaded", function(event) {
    devicename = getQueryParams().name;
    if (devicename) {
        var text = document.querySelector('#name');
        text.textContent = devicename;
    }

    connectToServer();
});

function showImage (index){
    var img = document.querySelector('#image');
    var msg = document.querySelector('#msg');
    if (index >= 0 && index <= imageCount){
        img.setAttribute("src", "images/" +index +".jpg");
        msg.style.display = 'none';
        img.style.display = 'block';
    }
    if (index == -1){
        msg.style.display = 'block';
        img.style.display = 'none';
    }
}

function clearImage(){
    var img = document.querySelector('#image');
    var msg = document.querySelector('#msg');
    img.style.display = 'none';
    msg.style.display = 'block';
}

function getQueryParams() {
    var qs =  window.location.search.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}


function connectToServer(){
    // TODO connect to the socket.io server
    //connect
    socket.emit('screen connect', devicename);
    socket.on('select '+devicename, function(msg){
        sequence = msg[1];
        showImage(msg[0]);
        
    });
    socket.on('are you there', function(name){
        if(name==devicename){
            alert('i\'m here!');
            socket.emit('screen connect', devicename);
        }
    });
    socket.on('clear screen', function(seq){
        if (seq>sequence) {
            showImage(-1);
        }
    });
        
    
   
    //update?
    //disconnect
}