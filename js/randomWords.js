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
                
                setWordsAndAnswers(JsonData);
        
            });
}

function setWordsAndAnswers(JsonData)
{
    var tempAnswers = [];
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

    allOptions = getOptionsWithoutAnswer($.unique(getRandomAnswer(answers, answer)), answer);

    console.log("answers without answer -- " + answers); 


    for(var i = 0; i < 4; i++)
    {
        options[i] = allOptions[i];
    }

    options[4] = answer;

    options = shuffleOptions(options);

    console.log("\n Selected Word -- " + word + ", Answer -- " + answer);

    displayWordAsQuestion(word);
    appendOptions(options);
}

function resetWordsAndAnswers()
{
    words = [];
    count = zero;
    answers = [];
    wordPosition = zero;
    word = "No Word";
    answer = "No Answer";
    allOptions = [];
    options = [];
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

function getRandomAnswer(answers, answer)
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

function getOptionsWithoutAnswer(allOptions, answer)
{
    var optionsWithoutAnswer = $.grep(allOptions, function(value)
                                        {
                                            return (value !== answer);    
                                        });
    return optionsWithoutAnswer;
    
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

function removeOptions()
{
    $("#option0").text("");
    $("#option1").text("");
    $("#option2").text("");
    $("#option3").text("");
    $("#option4").text("");
    
    animateOptions();
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
                    dataType: "text",
                    success: function(data)
                    {
                        if(data == correct)
                        {
                            setTimeout( function() 
                            {

                                var loader = new SVGLoader( document.getElementById( 'loader' ), { speedIn : 100 } );
                                // create the notification
                                var notification = new NotificationFx({
                                    message : '<span class="icon icon-megaphone"></span><p>You are correct. Get <a href="#">ready</a> for <a href="#">another one</a> now.</p>',
                                    layout : 'bar',
                                    effect : 'slidetop',
                                    type : 'notice', // notice, warning or error
                                    onClose : function() 
                                    {
                                        $("#selectAnswers").attr('disabled', true);
                                        loader.show();
					
                                        setTimeout( function() 
                                                    {
                                                        loader.hide();
                                                        window.location.reload();
                                                    },2000);
                                        //window.location.reload();
                                    }
                                });

                                // show the notification
                                notification.show();

                            }, 1200 );
                        }
                        else
                        {
                            setTimeout( function() 
                            {
                                var loader = new SVGLoader( document.getElementById( 'loader' ), { speedIn : 100 } );
                                // create the notification
                                var notification = new NotificationFx({
                                    message : '<span class="icon icon-bulb"></span><p>Your answer is incorrect. The answer is <a href="#">' + answer + '</a> Try again, now!</p>',
                                    layout : 'bar',
                                    effect : 'slidetop',
                                    type : 'error', // notice, warning or error
                                    onClose : function() 
                                    {
                                        loader.show();
					
                                        setTimeout( function() 
                                                    {
                                                        loader.hide();
                                                        window.location.reload();
                                                    },2000);
                                        //window.location.reload();
                                    }
                                });

                                // show the notification
                                notification.show();

                            }, 1200 );
                        }
                    },
                    error: function(result)
                    {
                        
                        console.log("\n Error \nStatus -- " + result.status + "\n Error Message -- " + result.responseText) 
                    }
                })
    });
    
});