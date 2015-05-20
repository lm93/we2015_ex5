var currentImage = 0; // the currently selected image
var imageCount = 7; // the maximum number of images available
var socket = io(); //connect;

var myScreen = 'alice';
var sequence = 0;

function showImage (index){
    // Update selection on remote
    currentImage = index;
    var images = document.querySelectorAll("img");
    document.querySelector("img.selected").classList.toggle("selected");
    images[index].classList.toggle("selected");

    // Send the command to the screen
    // TODO
    socket.emit("select", [myScreen, currentImage, sequence]);
}

function initialiseGallery(){
    var container = document.querySelector('#gallery');
    var i, img;
    for (i = 0; i < imageCount; i++) {
        img = document.createElement("img");
        img.src = "images/" +i +".jpg";
        document.body.appendChild(img);
        var handler = (function(index) {
            return function() {
                showImage(index);
            }
        })(i);
        img.addEventListener("click",handler);
    }

    document.querySelector("img").classList.toggle('selected');
}

document.addEventListener("DOMContentLoaded", function(event) {
    initialiseGallery();

    document.querySelector('#toggleMenu').addEventListener("click", function(event){
        var style = document.querySelector('#menu').style;
        style.display = style.display == "none" || style.display == ""  ? "block" : "none";
    });
    connectToServer();
});

function connectToServer(){
    // TODO connect to the socket.io server
    socket.emit('remote connect', 'I\'m a remote');
    
    socket.on('screen connect', function(name){
        alert(name + ' connected');
        if(name==myScreen) {
            socket.emit("select", [myScreen, currentImage]);
        }
    });
    
    socket.on('screen disconnect', function(name){
        alert(name + ' disconnected');
        
    });
    
    
    
    
    // todo on selecting a screen
    //socket.emit("select", [myScreen, currentImage]);
    
    
    socket.on('screen connect', function(name){
        alert('add '+ name +'to list');
        socket.emit("select", [myScreen, currentImage]);
    });
    
    socket.on('screen disconnect', function(name){
        alert('remove '+ name +'from list');
        //sure? count instances?
        //todo give list of screens. New connection?
    });
    
    socket.on('resend to screen', function(seq){
        sequence = seq;
        socket.emit("select", [myScreen, currentImage, sequence]);
    });
    
    
        
}