var JsonData;
var word;
var selectedAnswer;
var answerStatus;

var answer = "No Answer";
var correct = "correct";
var incorrect = "incorrect";

var zero = 0;

var count = zero;
var wordPosition = zero;

var words = [];
var answers = [];
var allOptions = [];
var options = [];

function getWordAndAnswer()
{
    var tempAnswers = [];
    $.ajax({
                url: "http://peaceful-thicket-5170.herokuapp.com/getWordAndAnswer",
                context: document.body
            }).done(function(data) 
            {
                JsonData = $.parseJSON(JSON.stringify(data));
                
                //Creates an array of words.
                $.each(JsonData, function(key, value)
                {
                    words[count] = key;
                    tempAnswers[count] = value;
                    count++;
                })
                
                answers = $.unique(tempAnswers);
                
                console.log("\n Size of Json returned from backend (Number of words) -- " + count);
        
                wordPosition = getRandomInt(zero, count);
                word = words[wordPosition];
                answer = getAnswer(JsonData, word);
        
                allOptions = $.unique(getRandomAnswer(answers, answer, count-1));
        
                for(var i = 0; i < 4; i++)
                {
                    options[i] = allOptions[i];
                }
                
                options[4] = answer;
                                
                options = shuffleOptions(options);
        
                console.log("\n Selected Word -- " + word + ", Answer -- " + answer);
        
                displayWordAsQuestion(word);
                appendOptions(options);
        
            });
}

function getRandomInt(min, max) 
{
  return Math.floor(Math.random() * (max - min)) + min;
}

function getAnswer(JsonData, word)
{
    $.each(JsonData, function(key, value)
    {
        if(key == word)
        {
            answer = value;
        }
    })
    
    return answer;
}

function getRandomAnswer(answers, answer, count)
{
    var tempOptions = [];
    console.log("\n Answers -- " + answers);
    
    for(var i = 0; i<answers.length; i++)
    {
        var option = answers[i];
        tempOptions[i] = option;
    }
    
    console.log("\n Original Options -- " + tempOptions);
    
    allOptions = shuffleOptions(tempOptions);
    console.log("\n Shuffled Options -- " + allOptions);
    
    return allOptions;
}

function shuffleOptions(options)
{
    var shuffledOptions = [];
    shuffledOptions = window.knuthShuffle(options.slice(0));
    return shuffledOptions;
}

function appendOptions(options)
{
    $("#option0").text(options[0]);
    $("#option1").text(options[1]);
    $("#option2").text(options[2]);
    $("#option3").text(options[3]);
    $("#option4").text(options[4]);
    
    animateOptions();
    
    $("#checkAnswer").prop('disabled', false);
}

function displayWordAsQuestion(word)
{
    $("#select-label").text(word);
}

function animateOptions()
{
    [].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {	
					new SelectFx(el);
				} );
}

$(document).ready(function()
{
    $("#checkAnswer").prop('disabled', true);
    getWordAndAnswer();
    
    $("#checkAnswer").click(function()
    {
        selectedAnswer = $("#selectAnswers option:selected").text();
        $.ajax({
                    url: "http://peaceful-thicket-5170.herokuapp.com/getWordAndAnswer/checkAnswer?word=" + word + "&answer=" + selectedAnswer,
            context: document.body
                    
                }).done(function(data) 
                {
                    console.log(data.toString());
                    /*if(data.toString() == correct)
                    {

                        alert("CORRECT");
                        //window.location.reload();
                    }
                    else if(data.toString() == incorrect)
                    {
                        alert("INCORRECT");
                    }
                    else
                    {
                        alert("Some error occurred!");
                    }*/

                });
    });
    
});
