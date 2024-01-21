//initialize top level variables
//global currentQuestionNumber variable.
var currentQuestion=0;
var highlights=[];


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
        type: ["text","text"],
        question: "<br><br><br><br>Herzlich Willkommen<br>zum Experiment",
        answers: {
            
        },
        correctAnswer: "",
        highlights: []
    },
    {
        type: ["text","text"],
        question: "Mit welchem Geschlecht defininieren Sie sich?",
        answers: {
            a: "Weiblich",
            b: "Männlich",
            c: "Divers",
            d: "Keine Angabe"
        },
        correctAnswer: "",
        highlights: []
    },
    {
        type: ["text","field"],
        question: "Wie alt sind Sie?",
        answers: {
            a: ""
        },
        correctAnswer: "",
        highlights: []
    },
    {
        type: ["text","andfield"],
        question: "Was studieren Sie?",
        answers: {
        a: "Kognitionswissenschaft",
        b:"Psychologie"
        },
        correctAnswer: "",
        highlights: []
    },
    {
        type: ["text","text"],
        question: "Was war Ihre letzte Kunstnote?",
        answers: {
        a: "sehr gut (Note 1 oder 13/14/15 Punkte)",
        b: "gut (Note 2 oder 10/11/12 Punkte)",
        c: "befriedigend (Note 3 oder 7/8/9 Punkte)",
        d: "ausreichend (Note 4 oder 4/5/6 Punkte)",
        e: "mangelhaft (Note 5 oder 1/3/3 Punkte)",
        f: "ungenügend (Note 6 oder 0 Punkte)"
        },
        correctAnswer: "",
        highlights: []
    },
    {
       type: ["text","text"],
       question: "Hatten Sie Kunst in der Schule in der Oberstufe (Klasse 10/11/12/13) ...?",
       answers: {
       a: "Ja, als Leistungskurs/als Profil- oder Neigungsfach",
       b: "Ja, als Grundkurs/zweistündigen wöchentlichen Kurs",
       c: "Nein"
       },
       correctAnswer: "",
       highlights: []
   },
   {
      type: ["textsubtext","text"],
      question: "Wie häufig waren Sie innerhalb des letzten Jahres in einem Kunstmuseum bzw. in einer Kunstausstellung?",
      subtext: "Nicht gemeint sind hier Volkskunde-, Heimatkunde-, Schloss- und Burgmuseen, naturkundliche, natur- wissenschaftliche/technische oder Sammelmuseen.",
      answers: {
      a: "nie",
      b: "1 bis 3 Mal",
      c: "3 bis 6 Mal",
      d: "mehr als 6 Mal"
      },
      correctAnswer: "",
      highlights: []
  },
  {
  type: ["text","likert"],
      question: "Wie schätzen Sie Ihr kunstspezifisches Wissen ein?",
      answers: {
      a: "sehr gering",
      b: "gering",
      c: "mittelmäßig",
      d: "hoch",
      e: "sehr hoch"
      },
      correctAnswer: "",
      highlights: []
  },
  {
  type: ["text","likert"],
      question: "Wie schätzen Sie Ihr Interesse an Kunst ein?",
      answers: {
      a: "sehr gering",
      b: "gering",
      c: "mittelmäßig",
      d: "hoch",
      e: "sehr hoch"
      },
      correctAnswer: "",
      highlights: []
  },
  {
  type: ["text","likert"],
      question: "Bitte geben Sie für die folgenden Aussagen an, <br>inwieweit sie jeweils auf Sie persönlich zutreffen.",
      answers: {
      
      },
      correctAnswer: "",
      highlights: []
  },
  {
  type: ["text","likert"],
      question: "Ich setze mich in meinem persönlichen Umfeld und Alltag (Familie, Freunde, Kollegen) mit Kunst auseinander.",
      answers: {
      a: "überhaupt nicht",
      b: "wenig",
      c: "mittelmäßig",
      d: "ein wenig",
      e: "sehr"
      },
      correctAnswer: "",
      highlights: []
  },
  {
  type: ["text","likert"],
      question: "Ich kenne mich mit bestimmten Künstlern, Epochen oder Stilrichtungen aus.",
      answers: {
      a: "überhaupt nicht",
      b: "wenig",
      c: "mittelmäßig",
      d: "ein wenig",
      e: "sehr"
      },
      correctAnswer: "",
      highlights: []
  },
  {
  type: ["text","likert"],
      question: "Ich würde gerne mehr über Kunstwerke und Künstler wissen.",
      answers: {
      a: "überhaupt nicht",
      b: "wenig",
      c: "mittelmäßig",
      d: "ein wenig",
      e: "sehr"
      },
      correctAnswer: "",
      highlights: []
  },
  {
  type: ["text","likert"],
      question: "Wenn ich ein Kunstwerk betrachte, vergleiche ich es mit anderen Kunstwerken, die ich kenne.",
      answers: {
      a: "überhaupt nicht",
      b: "wenig",
      c: "mittelmäßig",
      d: "ein wenig",
      e: "sehr"
      },
      correctAnswer: "",
      highlights: []
  },
  {
  type: ["text","likert"],
      question: "Ich erkenne Kunstwerke aus der gleichen Epoche bzw. vom selben Künstler wieder.",
      answers: {
      a: "überhaupt nicht",
      b: "wenig",
      c: "mittelmäßig",
      d: "ein wenig",
      e: "sehr"
      },
      correctAnswer: "",
      highlights: []
  },
  {
   type: ["text","likert"],
       question: "Kunst spielt in meinem Leben eine wichtige Rolle.",
       answers: {
       a: "überhaupt nicht",
       b: "wenig",
       c: "mittelmäßig",
       d: "ein wenig",
       e: "sehr"
       },
       correctAnswer: "",
       highlights: []
   },
   {
       type: ["text","likert"],
           question: "Wenn ich ein Kunstwerk betrachte, frage ich mich nach seiner tieferen Bedeutung.",
           answers: {
           a: "überhaupt nicht",
           b: "wenig",
           c: "mittelmäßig",
           d: "ein wenig",
           e: "sehr"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["text","likert"],
           question: "Ich interessiere mich für die Geschichten und Hintergründe der einzelnen Kunstwerke.",
           answers: {
           a: "überhaupt nicht",
           b: "wenig",
           c: "mittelmäßig",
           d: "ein wenig",
           e: "sehr"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["text","likert"],
           question: "Ich lese gerne Beiträge über Kunst in der Zeitung/im Internet oder in Kunstzeitschriften.",
           answers: {
           a: "überhaupt nicht",
           b: "wenig",
           c: "mittelmäßig",
           d: "ein wenig",
           e: "sehr"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["text","likert"],
           question: "Ich unterhalte mich gerne mit anderen (z.B. Freundeskreis, Familie) über Kunst.",
           answers: {
           a: "überhaupt nicht",
           b: "wenig",
           c: "mittelmäßig",
           d: "ein wenig",
           e: "sehr"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["text","likert"],
           question: "Ich informiere mich über aktuelle Kunstausstellungen.",
           answers: {
           a: "überhaupt nicht",
           b: "wenig",
           c: "mittelmäßig",
           d: "ein wenig",
           e: "sehr"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["text","pft"],
           question: "Es folgt der Paper Folding test, <br> halten Sie sich bitte an die folgenden Anweisungen",
           answers: {
           a: "qpImages/pft/pft1.png"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["text","test"],
           question: "<br><br>Bitte beachten Sie, dass die 3 Minuten für den Paper Folding Test ab der nächsten Seite laufen.",
           answers: {
           a: ""
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["img","img"],
           question: "qpImages/pft/1.png",
           answers: {
           a: "qpImages/pft/1a.jpg",
           b: "qpImages/pft/1b.jpg",
           c: "qpImages/pft/1c.jpg",
           d: "qpImages/pft/1d.jpg",
           e: "qpImages/pft/1e.jpg"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["img","img"],
           question: "qpImages/pft/2.png",
           answers: {
           a: "qpImages/pft/2a.jpg",
           b: "qpImages/pft/2b.jpg",
           c: "qpImages/pft/2c.jpg",
           d: "qpImages/pft/2d.jpg",
           e: "qpImages/pft/2e.jpg"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["img","img"],
           question: "qpImages/pft/3.png",
           answers: {
           a: "qpImages/pft/3a.jpg",
           b: "qpImages/pft/3b.jpg",
           c: "qpImages/pft/3c.jpg",
           d: "qpImages/pft/3d.jpg",
           e: "qpImages/pft/3e.jpg"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["img","img"],
           question: "qpImages/pft/4.png",
           answers: {
           a: "qpImages/pft/4a.jpg",
           b: "qpImages/pft/4b.jpg",
           c: "qpImages/pft/4c.jpg",
           d: "qpImages/pft/4d.jpg",
           e: "qpImages/pft/4e.jpg"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["img","img"],
           question: "qpImages/pft/5.png",
           answers: {
           a: "qpImages/pft/5a.jpg",
           b: "qpImages/pft/5b.jpg",
           c: "qpImages/pft/5c.jpg",
           d: "qpImages/pft/5d.jpg",
           e: "qpImages/pft/5e.jpg"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["img","img"],
           question: "qpImages/pft/6.png",
           answers: {
           a: "qpImages/pft/6a.jpg",
           b: "qpImages/pft/6b.jpg",
           c: "qpImages/pft/6c.jpg",
           d: "qpImages/pft/6d.jpg",
           e: "qpImages/pft/6e.jpg"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["img","img"],
           question: "qpImages/pft/7.png",
           answers: {
           a: "qpImages/pft/7a.jpg",
           b: "qpImages/pft/7b.jpg",
           c: "qpImages/pft/7c.jpg",
           d: "qpImages/pft/7d.jpg",
           e: "qpImages/pft/7e.jpg"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["img","img"],
           question: "qpImages/pft/8.png",
           answers: {
           a: "qpImages/pft/8a.jpg",
           b: "qpImages/pft/8b.jpg",
           c: "qpImages/pft/8c.jpg",
           d: "qpImages/pft/8d.jpg",
           e: "qpImages/pft/8e.jpg"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["img","img"],
           question: "qpImages/pft/9.png",
           answers: {
           a: "qpImages/pft/9a.jpg",
           b: "qpImages/pft/9b.jpg",
           c: "qpImages/pft/9c.jpg",
           d: "qpImages/pft/9d.jpg",
           e: "qpImages/pft/9e.jpg"
           },
           correctAnswer: "",
           highlights: []
   },
   {
       type: ["img","img"],
           question: "qpImages/pft/10.png",
           answers: {
           a: "qpImages/pft/10a.jpg",
           b: "qpImages/pft/10b.jpg",
           c: "qpImages/pft/10c.jpg",
           d: "qpImages/pft/10d.jpg",
           e: "qpImages/pft/10e.jpg"
           },
           correctAnswer: "",
           highlights: []
   },

   {
       type: ["text","text"],
           question: "<br><br><br>Sie sind fertig, clicken sie bitte submit",
           answers: {
           
           },
           correctAnswer: "",
           highlights: []
   }
];

var startTime = getTime();

var data = "part,month,day,hour,minutes,seconds,milliseconds,currentQuestion,action,correct\n";
var ddata = new Blob([data]);

log("start");

console.log("questionpanel3.js says hello");


const nextButton = document.getElementById("next");

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
//const submitButton = document.getElementById('submit');

// on submit, show results
//submitButton.addEventListener('click', showResults);
nextButton.addEventListener("click", showNextSlide);
//submitButton.addEventListener("click", submitButtonPress);




function showPreviousSlide(){
    if(currentQuestion<=0){

    }else{
        currentQuestion--;
        showQuestion(currentQuestion);

    }

}

function showNextSlide(){
    currentQuestion++;        
    if(currentQuestion+1>=myQuestions.length){
        document.getElementById("next").style.display="none";  
        document.getElementById("a").style.display="initial";  
        showQuestion(currentQuestion);
    }else{
        log("next");
        showQuestion(currentQuestion);
    }

   
}

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
            answers.push(
                `
                <label>
                <input type="radio" id="${n}${letter}" name="question${n}" value="${letter}" onclick="log(this.id)">
                <img src="${Question.answers[letter]}" alt="" > 
                </label>
                `
            );
        }

        if(Question.type[1]=="field"){
            answers.push(
                `
                <label>
                <input type="text" id="${n}" onkeyup="log(this.value)">
                </label>
                `
            );
        }

        if(Question.type[1]=="andfield"){
            answers.push(
                `
                <label>
                <input type="radio" id="${n}${letter}" name="question${n}" value="${letter}" onclick="log(this.id)">
                ${Question.answers[letter]}
                </label>
                `
            );
            if(letter=="b"){
                answers.push(
                    `
                    <label>
                    <input type="radio" id="${n}${letter}" name="question${n}" value="${letter}" onclick="log(this.id)">
                    <input type="text" id="${n}" onkeyup="log(this.value)" placeholder="Anderer Studiengang">
                    </label>
                    `
                );
            }
        }

        if(Question.type[1]=="pft"){
            answers.push(
                `
                <label>
                <img class="pft" src="${Question.answers[letter]}" alt="" > 
                </label>
                `
            );
        }
        
        if(Question.type[1]=="likert"){
            answers.push(
                `
                <label>
                <input type="radio" id="${n}${letter}" name="question${n}" value="${letter}" onclick="log(this.id)">
                ${Question.answers[letter]}
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

    if(Question.type[0]=="textsubtext"){
        output.push(
            `
            <div class="question-text"> ${Question.question} </div>
            <div class="question-subtext"> ${Question.subtext} </div>
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
    quizContainer.innerHTML = output.join('');
}

//createListeners() creates Listeners for Radios with Ids: (QuestionNumber, AnswerLetter)
function createListeners(QuestionNumber, numOfAnswers){
    var alphabet = "abcdefghijklmnopqrstuvwxyz"
    for(var i=0; i<numOfAnswers; i++){
        document.getElementById(QuestionNumber+""+alphabet.charAt(i)).addEventListener("click", outCry);
    }
}




//pushes action p to data[]
function log(p){
    var t=getTime();
    //var t=getElapsedTime();
    //var tt=translateTimeArrayToString(t);
    data=data+vp+","+"3,"+t+","+currentQuestion+","+p+","+isCorrect(p)+"\n";
    ddata = new Blob([data]);
    var a = document.getElementById('a');
    a.href = URL.createObjectURL(ddata);    
    
    var tString=translateTimeArrayToString(t);
    console.log(vp+","+"3,"+t+","+currentQuestion+","+p+","+isCorrect(p));
}

function logvp(p){
    vp=p;
    console.log(vp);
}


function cleanLog(log){
    
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

//isRadioChecked() checks if a radiobutton of one question has been check or not
function isRadioChecked(n){
    var alphabet = "abcdefghijklmnopqrstuvwxyz"
    for (i = 0; i < 5; i++) { 
        var btn=""+n+""+alphabet.charAt(i);
        if(document.getElementById(btn).checked) {
            return true;
        }    
    }
    return false;
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
    var sec = 180;
    var timer = setInterval(function(){

        var minutes = Math.floor(sec/60);
        var seconds = sec%60;
        document.getElementById('TimerDisplay').innerHTML=decimalize(minutes)+':'+decimalize(seconds);
        sec--;
        if (sec < 0) {
            clearInterval(timer);
            currentQuestion=33;
            log("timerdone");
            showQuestion(currentQuestion);
            document.getElementById("next").style.display="none";  
            document.getElementById("a").style.display="initial"; 
        }
    }, 1000);
}

showQuestion(currentQuestion);



