
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
        //1
        type: ["text","text"],
        question: "Bei welchem der folgenden Druckverfahren drucken die hochstehenden Partien der Platte auf das Papier?",
        answers: {
            a: "Aquatinta",
            b: "Kupferstich",
            c: "Radierung",
            d: "Linolschnitt"
        },
        correctAnswer: "d",
        highlights: ["071", "031", "042"]
    },
    {
        //2
        type: ["text","text"],
        question: "Welcher der folgenden Epochen folgt dem Ideal der Ruhe und Ausgewogenheit?",
        answers: {
            a: "Romantik",
            b: "Barock",
            c: "Renaissance",
            d: "Klassizismus"
        },
        correctAnswer: "d",
        highlights: ["109","155","105"]
    },
    {
        //3
        type: ["text","text"],
        question: "Starke Licht und Schattenkontraste sind ein Charakteristikum welcher der folgenden Epochen?",
        answers: {
            a: "Renaissance",
            b: "Barock",
            c: "Romantik",
            d: "Rokoko"
        },
        correctAnswer: "a",
        highlights: ["054","042","051"]
    },
    {
        //4
        type: ["text","text"],
        question: "Bei Radierung wird die Zeichung auf die Kupferplatte ... aufgebracht.",
        answers: {
            a: "auf dem Kopf",
            b: "mit dickeren Linien",
            c: "seitenverkehrt",
            d: "vergrößert"
        },
        correctAnswer: "c",
        highlights: ["031","042"]
    },
    {
        //5
        type: ["text","text"],
        question: "Worauf muss man bei der Analyse des Bildaufbaus NICHT achten?",
        answers: {
            a: "Aufteilung des Bildraums",
            b: "Kompositionslinien",
            c: "Aufteilung der Dargestellten im Bildraum",
            d: "Aufteilung der verwendeten Farben"
        },
        correctAnswer: "d",
        highlights: ["054","109","083","051","070","042"]
    },
    {
        //6
        type: ["text","text"],
        question: "In welcher Epoche war Dürer aktiv?",
        answers: {
            a: "Klassizismus",
            b: "Rokoko",
            c: "Renaissance",
            d: "Barock"
        },
        correctAnswer: "c",
        highlights: ["019"]
    },
    {
        //7
        type: ["text","text"],
        question: "Was für eine Atmosphäre schaffen starke Licht-Schatten-Kontraste?",
        answers: {
            a: "eine deprimierende Atmosphäre",
            b: "eine dramatische Atmosphäre",
            c: "eine harmonische Atmosphäre",
            d: "eine friedliche Atmosphäre"
        },
        correctAnswer: "b",
        highlights: ["051","054","042"]
    },
    {
        //8
        type: ["text","text"],
        question: "In welcher der folgenden Eigenschaften unterscheiden sich Klassizismus- und Barockmalerei stark",
        answers: {
            a: "Perspektiven",
            b: "Ruhe und Ausgewogenheit",
            c: "Herkunft",
            d: "Kraftverhältnisse"
        },
        correctAnswer: "b",
        highlights: ["083","109"]
    },
    {
        //9
        type: ["text","image"],
        question: "In welchem Werk ist kaltes Licht zu sehen?",
        answers: {
            a: "qpImages/lf06/caravaggio.jpg",
            b: "qpImages/lf06/familienbild.jpg",
            c: "qpImages/lf06/gewitterlandschaft.jpg",
            d: "qpImages/lf06/ruisdael.jpg"
        },
        correctAnswer: "d",
        highlights: ["129","020","083"]
    },
    {
        //10
        type: ["text","text"],
        question: "Caravaggio nutzte neben Schlaglicht auch ... zur verdeutlichung von Kräften",
        answers: {
            a: "Kreise",
            b: "Diagonalen",
            c: "Pastelfarben",
            d: "Überlappung"
        },
        correctAnswer: "b",
        highlights: ["054"]
    },
    {
        //11
        type: ["text","image"],
        question: "Welches der folgenden Werke stelle eine 'Ideallandschaft' dar",
        answers: {
            a: "qpImages/po03/Post03-2.jpg",
            b: "qpImages/po03/Post03-1.jpg",
            c: "qpImages/po03/Post03-4.jpg",
            d: "qpImages/po03/Post03-3.jpg"
        },
        correctAnswer: "a",
        highlights: ["070","083","109"]
    },
    {
        //12
        type: ["text","text"],
        question: "Was stellt die Pieta dar?",
        answers: {
            a: "die Dornenkrönung",
            b: "Maria an der Seite des sterbenden Jesu",
            c: "der gekreuzigte Jesu",
            d: "die Wiederauferstehung"
        },
        correctAnswer: "b",
        highlights: ["051"]
    },
    {
        //13
        type: ["text","image"],
        question: "Welches der folgenden Werke stellt weder eine historische, religiöse, mythisch-sagenhafte, oder literarische Thematik dar?",
        answers: {
            a: "qpImages/bi11/venus.jpg",
            b: "qpImages/bi11/familienbild.jpg",
            c: "qpImages/bi11/gelehrter.jpg",            
            d: "qpImages/bi11/sohn.jpg"
        },
        correctAnswer: "b",
        highlights: ["019","105"]
    },
    {
        //14
        type: ["text","text"],
        question: "Die ... Landschaftsmalerei orientierte sich an 'heimischen/alltäglichen' Umgebungen.",
        answers: {
            a: "niederländische",
            b: "italienische",
            c: "deutsche",
            d: "französische"
        },
        correctAnswer: "a",
        highlights: ["070","083","031"]
    },
    {
        //15
        type: ["imgtext","text"],
        question: "Welche der folgenden Methoden wurden hier NICHT verwendet um einen Effekt der Tiefe herzustellen?",
        image:"qpImages/ab01/hollar.jpg",
        answers: {
            a: "Aufteilung in verschiedene Ebenen",
            b: "Überdeckung",
            c: "Größenunterschiede",
            d: "Bedeutungsperspektive"
        },
        correctAnswer: "d",
        highlights: ["070","031","019"]
    },
    {
        //16
        type: ["text","text"],
        question: "Die Kunst welcher der folgenden Epochen gilt als verspielt und verschnörkelt?",
        answers: {
            a: "Rokoko",
            b: "Romantik",
            c: "Renaissance",
            d: "Barock"
        },
        correctAnswer: "a",
        highlights: ["098","101"]
    },
    {
        //17
        type: ["text","text"],
        question: "Woran kann man erkennen, ob ein Tonstück Majolika ist?",
        answers: {
            a: "an den verwendeten Farben",
            b: "an der Dünnheit",
            c: "am Gewicht",
            d: "an den Motiven"
        },
        correctAnswer: "a",
        highlights: ["033"]
    },
    {
        //18
        type: ["text","text"],
        question: "Welche der folgenden Eigenschaften ist keine Eigenschaft der Barockmalerei?",
        answers: {
            a: "Bewegung",
            b: "Dramatik",
            c: "Kontrast",
            d: "Symmetrie"
        },
        correctAnswer: "d",
        highlights: ["070","083"]
    },
    {
        //19
        type: ["text","image"],
        question: "Welche der folgenden Landschaften scheint nach der Natur gemalt zu sein?",
        answers: {
            a: "qpImages/bi03/lorrain.jpg",
            b: "qpImages/bi03/ruisdael.jpg",
            c: "qpImages/bi03/duenenlandschaft.jpg",            
            d: "qpImages/bi03/landschaft.jpg"
        },
        correctAnswer: "c",
        highlights: ["019","109","070"]
    },
    {
        type: ["text","text"],
        question: "Es gibt keine Fragen zum lernen mehr",
        answers: {
        },
        correctAnswer: "d",
        highlights: []
    }
    ,
    {
        type: ["text","text"],
        question: "Bitte melden Sie sich beim Versuchsleiter",
        answers: {
        },
        correctAnswer: "d",
        highlights: []
    }
];


var startTime = getTime();

var data = "part,month,day,hour,minutes,seconds,milliseconds,currentQuestion,action,correct\n";
var ddata = new Blob([data]);

timer();


log("start");


console.log("questionpanel2.js says hello");


//const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
//const submitButton = document.getElementById('submit');

// on submit, show results
//submitButton.addEventListener('click', showResults);
//previousButton.addEventListener("click", previousButtonPress);
nextButton.addEventListener("click", showNextSlide);
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

        if(Question.type[1]=="image"){
            answers.push(
                `
                <label>
                <input type="radio" id="${n}${letter}" name="question${n}" value="${letter}" onclick="log(this.id)">
                <div style="background-image: url(${Question.answers[letter]});height:250px;width:300px;background-size:contain;background-repeat: no-repeat;"></div> 
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
              <img src="${Question.question}" alt=""> 
            </div>
            <div class="answers-${Question.type[1]}"> ${answers.join("")} </div>
            `
    );
    }

    if(Question.type[0]=="imgtext"){
        output.push(
            `
            <div class="question-${Question.type[0]}"> 
                <div style="background-image: url(${Question.image});height:250px;width:300px;background-size:contain;background-repeat: no-repeat;margin-right:30px;margin-left:30px;margin-top:30px"></div>
                <br>
                ${Question.question}

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
function showNextSlide(){
    if(currentQuestion>=myQuestions.length||currentQuestion+2>=myQuestions.length){

    }else{
        currentQuestion++;
        log("next");
        if(currentQuestion+1>=myQuestions.length){
            document.getElementById("next").style.display="none";  
            document.getElementById("a").style.display="initial";  
            document.getElementById("a").download=vp+"_2"+".csv";
        }

        if(myQuestions[currentQuestion].type[1]=="image"){
            document.getElementsByClassName('quiz-container')[0].style.height="1180px";   
        }else{
            document.getElementsByClassName('quiz-container')[0].style.height="650px";   
        }
        showQuestion(currentQuestion);
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
    var dateTime = [today.getMonth(),today.getDate()-2,(today.getHours()),today.getMinutes(),today.getSeconds(),today.getMilliseconds()]

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
        if (sec <= 0) {
            document.getElementById("a").download=vp+"_2.csv";
            document.getElementById("next").style.display="none";  
            document.getElementById("a").style.display="initial";
            clearInterval(timer);
            //final page
            currentQuestion=myQuestions.length-1;
            log("timerdone");
            showQuestion(currentQuestion);
        }
    }, 1000);
}

showQuestion(currentQuestion);



