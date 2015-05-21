var currentImage = 0; // the currently selected image
var imageCount = 7; // the maximum number of images available
var socket = io(); //connect;

var myScreen = '';
var sequence = 0;

function showImage (index){
    // Update selection on remote
    currentImage = index;
    var images = document.querySelectorAll("img");
    document.querySelector("img.selected").classList.toggle("selected");
    images[index].classList.toggle("selected");

    
    //socket.emit("select", [myScreen, currentImage, sequence]);
    $('#screens .active').each(function(i){
        socket.emit("select", [$(this).prop('id'), currentImage, sequence]);
    });
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


/*
function setScreen(name) {
    if(myScreen!=name) {
        myScreen = name;
        socket.emit('refresh screens');
        
        $('#menu li').removeClass('active');
        $('#menu #'+name).addClass('active');
    }
}*/


function clicked(e) {
    $e = $(e);
    var name = $e.prop('id');
    $e.toggleClass('active');
        
    socket.emit('refresh screens');
    
}

function addButton(name) {
    //alert($('#screens #'+name)+' has length '+$('#screens #'+name).length);
    if($('#screens #'+name).length == 0){
        $('#screens').append('<li id="'+name+'" onclick="clicked(this);">'+name+'</li>');
    }
}
function removeButton(name) {
    $('#screens #'+name).remove();
}



function connectToServer(){
    // TODO connect to the socket.io server
    socket.emit('remote connect', 'I\'m a remote');
    
    socket.on('screen connect', function(name){
        //alert(name + ' connected');
        addButton(name);
        if(name==myScreen) {
            myScreen=name;
            socket.emit("select", [myScreen, currentImage, sequence]);
        }
    });
    
    /* no longer necessary, since li is removed
    socket.on('screen disconnect', function(name){
        //alert(name + ' disconnected');
        setScreen(-1)
    });
    */
    
    
    
    
    // todo on selecting a screen
    //socket.emit("select", [myScreen, currentImage]);
    
    
    
    socket.on('screen disconnect', function(name){
        //alert('remove '+ name +'from list');
        removeButton(name);
    });
    
    socket.on('resend to screen', function(seq){
        sequence = seq;
        $('#screens .active').each(function(i){
            socket.emit("select", [$(this).prop('id'), currentImage, sequence]);
        });
    });
    
    
        
}