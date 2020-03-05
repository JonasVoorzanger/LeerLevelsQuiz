// const csv = "https://leerlevels.s3-us-west-2.amazonaws.com/LLQuiz+-+Blad1+(2).csv";
// $.ajax({
//   type: "GET",
//   contentType: 'html',
//   url: csv,
//   success: function(data) {
//     console.log(data);
//   }
// });
// let results = [];
// const csvData = Papa.parse(csv, {
//   header: true,
//   download: true,
//   complete: response => {
//     results = response.data;
//   }
// });


function preProcessQuestions(db_questions){
  new_questions = db_questions
  for (var i = 0; i < db_questions.length; i++) {
    var new_question = db_questions[i]
    var new_answers = []
    for (var j = 1; j < 7; j++) {
      var answer = {}
      answer["text"]=new_question["A"+j.toString()]
      answer["correct"]=new_question["C"+j.toString()]
      answer["feedback"]=new_question["F"+j.toString()]
      new_answers.push(answer)
    }
    new_question["Answers"]=new_answers
    new_questions[i] = new_question
  }
  console.log(new_questions)
  return new_questions
}

function setGlobals(){
  window.stage = "question";
  window.dataset
  dataset = preProcessQuestions(questions_data2)
  window.num_questions = dataset.length
  window.currentQuestion = 0;
  window.question_text
  window.question_id
  window.question_explanation
  window.user_data = []
}

function hideAll(){
  var stages = ["landing","quiz","question","summary"];
  for (var i = 0; i < stages.length; i++) {
    $("#"+stages[i]+"-stage").hide()
  }
}

function addStuff(){
  $("#Quiz-title").text("Demo quiz")
  $("#Quiz-description").text("Dit worden de instructies")
  $("#Select-button").click(function(){
    console.log("Select quiz")
    selectQuiz($("#Quiz-selection").val())
  });
  $("#Start-button").click(function(){
    console.log("Start questions")
    setStage("question")
  });
  $("#Next-button").click(function(){
    console.log("Next question")
    currentQuestion ++
    setStage("question")
  });
}

function selectQuiz(name){
  if(name == "Eerste" || name == "Tweede" || name == "Derde"){
    dataset = questions_data;
    setStage("quiz")
  }
}

function setStage(stage){
  stage = stage;
  if (currentQuestion==num_questions){stage = "summary"}
  hideAll()
  if (stage == "landing") {
    $("#landing-stage").show()
    console.log("LANDING")
  } else if (stage == "quiz") {
    console.log("QUIZ")
    $("#quiz-stage").show()
  } else if (stage == "question") {
    console.log("QUESTION")
    showQuestion(currentQuestion)
    $("#question-stage").show()
  } else if (stage == "feedback") {
    console.log("FEEDBACK")
    $("#question-stage").show()
  } else if (stage == "summary") {
    console.log("SUMMARY")
    $("#summary-stage").show()
    showSummary()
  } else {
    console.log("ERROR!")
  }
}

function showAnswerHTML(answers){
  $("#Next-button").hide()
  $("#Answers").empty()
  console.log(answers)
  var answer_list = $("#Answers").append("<ul class='list-group' id='answer_list'></ul>")
  for (var i = 0; i < answers.length; i++) {
    var answer_text = answers[i]["text"]
    var answer_id = "A"+(i+1).toString()
    var feedback_text = answers[i]["feedback"]
    var feedback_id = "F"+(i+1).toString()
    var correct = (answers[i]["correct"]==1)
    if (answer_text != "") {
      console.log(answer_text)
      $("#answer_list").append("<li class='answer list-group-item rounded-0' id="+answer_id+"></li>")     
      markjax(answer_text.toString(), document.getElementById(answer_id))
    }
    // if (feedback_text != "") {
    //       $("#answer_list").append("<div class='container p-3 feedback' id="+feedback_id+"></div")
    //       markjax(feedback_text, document.getElementById(feedback_id))
    //       $("#"+feedback_id).hide()
    // }
    $("#"+answer_id).attr("correct",correct)
    $("#"+answer_id).attr("feedback",feedback_text)
    $("#"+answer_id).attr("feedback_id",feedback_id)
    $("#"+answer_id).attr("text",answer_text)
    $("#"+answer_id).attr("value",(i+1))
    $("#"+answer_id).click(function(){
      console.log(this.value)
      $(this).addClass("bg-light")
      showFeedback(this.value)
    });
  }
}

function showFeedback(choice){
  console.log("Choice is: "+choice.toString())
  $('.answer').off('click') // Disable future clicks
  $(".answer").removeClass("answer")
  var correct = $("#A"+choice.toString()).attr("correct")
  var feedback_text = $("#A"+choice.toString()).attr("feedback")
  var feedback_id = $("#A"+choice.toString()).attr("feedback_id")
  var answer_text = $("#A"+choice.toString()).attr("text")
  console.log(correct)
  var color = (correct == 'true') ? 'green' : 'red';
  $("#A"+choice.toString()).css('color', color);
  if (feedback_text != "") {
      $("#A"+choice.toString()).append("<div class='container p-3 feedback' id="+feedback_id+"></div")
      markjax(feedback_text, document.getElementById(feedback_id))
  }
  if (correct == 'true' && question_explanation != ""){
    $("#Answers").append("<div class='container p-3 explanation' id='explanation'></div>")
    markjax(question_explanation, document.getElementById("explanation"))
  }
  $("#Next-button").show()
  var answer_data = {
    "Q_text": question_text, 
    "Q_id": question_id, 
    "A_text": answer_text,
    "A_id": "#A"+choice.toString(),
    "A_correct": correct
  }
  user_data.push(answer_data)
}

function showSummary(){
  // $("#summary-stage").empty()
  // $("#summary-stage").append("<p>Hier komt een samenvatting</p>")
}

// function showAnswerHTML(answers){
//   $("#Answers").empty()
//   console.log(answers.length)
//   var answer_list = $("#Answers").append("<ol id='answer_list'></ol>")
//   for (var i = 0; i < answers.length; i++) {
//     $("#answer_list").append("<li>"+answers[i]["text"]+"</li>")
//   }
// }

function showQuestion(n){
  var question = dataset[n]
  console.log(question)
  question_text = question["Question"]
  question_id = question["Question_ID"]
  question_explanation = question["Explanation"]
  markjax(question_text, document.getElementById("Question"))
  // $("#Question").empty().append("\n\n"+question_text)
  var answers = question["Answers"]
  showAnswerHTML(answers)
}