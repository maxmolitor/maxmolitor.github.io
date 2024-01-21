
//initialize top level variables
//global currentQuestionNumber variable.
var currentQuestion=0;
var highlights=[];
var vp;

//Questions have 4 types:
 //textimg
 //imgimg
 //texttext
 //imgtext
 //the question type is defined by type[0] and the answer type by type[1]

 //source defines the location of the image

 var myQuestions = [
    {
        type: ["text","vpfield"],
        question: "VP Nummer bitte eintragen",
        answers: {
            a:""
        },
        correctAnswer: "",
        highlights: []
    },
    {
        type: ["img","img"],
        question: "Welches der folgenden Werke hat einen ähnlichen Aufbau wie das gezeigte Werk?",
        image: "qpImages/ab05/kaninchenjagd.jpg",
        answers: {
            a: "1280px-Die_Heuernte.jpg",
            b: "1280px-Pieter_Bruegel_the_Elder_-_Hunters_in_the_Snow_(Winter)_-_Google_Art_Project.jpg",
            c: "1280px-Pieter_Bruegel_the_Elder-_The_Harvesters_-_Google_Art_Project.jpg",
            d: "Pieter_Bruegel_the_Elder_-_The_Temptation_of_St_Anthony_-_WGA3339"
        },
        correctAnswer: "c",
        highlights: ["020"]
    },
    {
        type: ["text","text"],
        question: "Technical usage is?",
        answers: {
            a: "preferred",
            b: "not mandatory",
            c: "useless"
        },
        correctAnswer: "c",
        highlights: ["019"]
    },
    {
        type: ["text","text"],
        question: "Van gogh painted which painting?",
        answers: {
            a: "A starry night",
            b: "Mona Lisa",
            c: "The last supper",
            d: "dreams"
        },
        correctAnswer: "d",
        highlights: ["033"]
    },
    {
        type: ["text","img"],
        question: "Do you recognize a painting?",
        answers: {
        a: "qpImages/image1.jpg",
        b: "qpImages/image1.jpg",
        c: "qpImages/image1.jpg",
        d: "qpImages/image1.jpg"
        },
        correctAnswer: "d",
        highlights: ["033"]
    },
    {
        type: ["img","img"],
        question: "qpImages/image1.jpg",
        answers: {
        a: "qpImages/image1.jpg",
        b: "qpImages/image1.jpg",
        c: "qpImages/image1.jpg",
        d: "qpImages/image1.jpg"
        },
        correctAnswer: "d",
        highlights: ["019","083"]
    }
];


var startTime = getTime();

var data = "vp,part,month,day,hour,minutes,seconds,milliseconds,currentQuestion,action,correct\n";
var ddata = new Blob([data]);

timer();


log("start");


console.log("questionpanel2.js says hello");


const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
//const submitButton = document.getElementById('submit');

// on submit, show results
//submitButton.addEventListener('click', showResults);
previousButton.addEventListener("click", previousButtonPress);
nextButton.addEventListener("click", nextButtonPress);
//submitButton.addEventListener("click", submitButtonPress);


 

function showQuestion(n){
    Question = myQuestions[n];

    //container for total html output for currentQuestion
    const output=[];

    //container for all answers for currentQuestion
    const answers=[];
    
    //cycle thru all answers of currentQuestion, and store resulting code in the answers[]
    for(letter in Question.answers){

        //Question[0] defines the question type, image or text
        //Question[1] define the answer type, image or text
        //add answer code depending on answer type
        if(Question.type[1]=="text"){
            //pass action to outCry();
            answers.push(
                `
                <label>
                <input type="radio" id="${n}${letter}" name="question${n}" value="${letter}" onclick="log(this.id)">
                ${letter} :
                ${Question.answers[letter]}
                </label>
                `
            );
        }
        
        if(Question.type[1]=="img"){
            //pass action to outCry();
            answers.push(
                `
                <label>
                <input type="radio" id="${n}${letter}" name="question${n}" value="${letter}" onclick="log(this.id)">
                <img src="${Question.answers[letter]}" alt="" > 
                </label>
                `
            );
        }

        if(Question.type[1]=="vpfield"){
            answers.push(
                `
                <label>
                <input type="text" id="${n}" onkeyup="logvp(this.value)">
                </label>
                `
            );
        }
        
    }

    //make output[] depending on question type
    if(Question.type[0]=="text"){
        output.push(
            `
            <div class="question-${Question.type[0]}"> ${Question.question} </div>
            <div class="answers-${Question.type[1]}"> ${answers.join("")} </div>
            `
    );
    }

    if(Question.type[0]=="img"){
        output.push(
            `
            <div class="question-${Question.type[0]}"> 
                ${Question.question}
                <div style="background-image: url(${Question.image});height:300px;width:300px;background-size:contain;background-repeat: no-repeat;"></div>

            </div>
            <div class="answers-${Question.type[1]}"> ${answers.join("")} </div>
            `
    );
    }
    quizContainer.innerHTML = output.join('');
}

//createListeners() creates Listeners for Radios with Ids: (QuestionNumber, AnswerLetter)
function createListeners(QuestionNumber, numOfAnswers){
    var alphabet = "abcdefghijklmnopqrstuvwxyz"
    for(var i=0; i<numOfAnswers; i++){
        document.getElementById(QuestionNumber+""+alphabet.charAt(i)).addEventListener("click", outCry);
    }
}

//nextButton and prev.Button are called by the listener when they are pressed
function nextButtonPress(){
    if(currentQuestion>=myQuestions.length){

    }else{
        currentQuestion++;
    }
   

    log("next");

    showQuestion(currentQuestion);
}

function previousButtonPress(){
     if(currentQuestion<=0){

    }else{
        currentQuestion--;
    }

    log("prev");

    showQuestion(currentQuestion);
}


//pushes action p to data[]
function log(p){
    var t=getTime();
    //var t=getElapsedTime();
    //var tt=translateTimeArrayToString(t);
    data=data+vp+","+"2,"+t+","+currentQuestion+","+p+","+isCorrect(p)+"\n";
    ddata = new Blob([data]);
    var a = document.getElementById('a');
    a.href = URL.createObjectURL(ddata);    
    
    var tString=translateTimeArrayToString(t);
    console.log(vp+","+"2,"+t+","+currentQuestion+","+p+","+isCorrect(p));
}

function logvp(p){
    vp=p;
    console.log(vp);
}

function outFly(){
    console.log("fly");
}

//return array with the form: [year, month, day, hour, minutes, seconds, milliseconds]
function getTime(){
    var today = new Date();
    var date = today.getYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = [today.getMonth(),today.getDate(),today.getHours(),today.getMinutes(),today.getSeconds(),today.getMilliseconds()]

    return dateTime;
}

//return timedifference between currentTime and StartTime; elapsedTime
function getElapsedTime(){
    var difference = [getTime()[0]-startTime[0], getTime()[1]-startTime[1], getTime()[2]-startTime[2], getTime()[3]-startTime[3], getTime()[4]-startTime[4], getTime()[5]-startTime[5]];
    return difference;
}

//convertTimes in arrays to strings for debug purposes
function translateTimeArrayToString(timeArray){
    diffString = timeArray[0]+" "+timeArray[1]+" "+timeArray[2]+" "+timeArray[3]+" "+timeArray[4]+" "+timeArray[5];
    return diffString;
}

//returns boolstring if current question answer is equal to correct answer
//still to do, does not work 100%;
function isCorrect(action){
    var QuestionK = myQuestions[currentQuestion];
    var currCorrectAnswer=QuestionK.correctAnswer;
    if(action==(currentQuestion+""+currCorrectAnswer)) {
        return "true";
    }else if(action=="next" || action=="start"){
        return "none";
    }else if(currCorrectAnswer==""){
        return "none";
    }else{
        return "false";
    }
}

//takes a number converts it to string and puts so many zeros infront as so it has 2 digits
function decimalize(n){
    if(getlength(n)<=1){
        return "0"+n.toString();
    }else{
        return n.toString();
    }
}

function getlength(number) {
    return number.toString().length;
}

function timer(){
    var sec = 1800;
    var timer = setInterval(function(){

        var minutes = Math.floor(sec/60);
        var seconds = sec%60;
        document.getElementById('TimerDisplay').innerHTML=decimalize(minutes)+':'+decimalize(seconds);
        sec--;
        if (sec < 0) {
            clearInterval(timer);
            //final page
            currentQuestion=33;
            log("timerdone");
            showQuestion(currentQuestion);
        }
    }, 1000);
}

showQuestion(currentQuestion);
