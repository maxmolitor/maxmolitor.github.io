var w = window.innerWidth;
var h = window.innerHeight;

document.getElementById('frame1').width= 0.65*w+"px";
document.getElementById('frame2').width= 0.35*w+"px"

document.getElementById("first_toggle").onclick = function(){
var timeStampOfClick = new Date();
document.getElementById('frame1').width= w+"px";
document.getElementById('frame1').height= (w)/1.6+"px"

document.getElementById('frame2').width= 0*w+"px";
}


document.getElementById("second_toggle").onclick = function(){
var timeStampOfClick = new Date();
document.getElementById('frame1').width= 0.65*w+"px";
document.getElementById('frame1').height= "660px"
//document.getElementById('frame1').height= (0.65*w)/1.6+"px"
document.getElementById('frame2').width= 0.35*w+"px";
}


document.getElementById("third_toggle").onclick = function(){
var timeStampOfClick = new Date();
document.getElementById('frame1').width= 0.57*w+"px";
document.getElementById('frame1').height= "560px"
//document.getElementById('frame1').height= (0.57*w)/1.6+"px"
document.getElementById('frame2').width= 0.43*w+"px";
}
