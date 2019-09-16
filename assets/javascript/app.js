topics = ["Jake Peralta", "Rosa Diaz", "Terry Jeffords", "Amy Santiago", "Charles Boyle", "Gina Linetti", "Raymond Holt", "Hitchcock 99", "Scully 99", "the 99"];

$(document).ready(function(){

    function buttonMaker() {
        $("#buttons-view").empty();
        for (var i = 0; i < topics.length; i++) {
            var a = $("<button>");
            a.addClass("99-btn");
            a.attr("data-name", topics[i]);
            a.text(topics[i]);
            $("#buttons-view").append(a);
        }
    }

    $("#add-topic").on("click", function(event) {
        event.preventDefault();
        var newTopic = $("#topic-input").val().trim();
        topics.push(newTopic);
        buttonMaker();
    });

    function displayGifs() {
        var topicToDisplay = $(this).attr("data-name");
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=uHRSYqUJ9J8SbR9afkR7ER1ahpRP40py&q=" + topicToDisplay + "&limit=10&rating=pg";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            for (var i = 0; i < 10; i++) {
                var gifDiv = $("<div class='gif float-left m-1'>");
                var gifURL = response.data[i].images.fixed_width_still.url;
                var gifStillURL = response.data[i].images.fixed_width_still.url;
                var gifMovingURL = response.data[i].images.fixed_width.url;
                var ratingValue = response.data[i].rating;
                var ratingText = $("<p>Rating: " + ratingValue + "</p>");
                var gifImage = $("<img>").attr({"src":gifURL,"data-still":gifStillURL,"data-move":gifMovingURL,"data-isMoving":"no","class":"isAGIF"});
                gifDiv.append(ratingText);
                gifDiv.append(gifImage);
                $("#gifLand").prepend(gifDiv);
            }
        });
    };


    $(document).on("click", ".99-btn", displayGifs);

    $(document).on("click",".isAGIF", function() {
        // console.log(this);
        var playingYet = $(this).attr("data-isMoving");
        var stillURL = $(this).attr("data-still");
        var movingURL = $(this).attr("data-move");
        if(playingYet == "no") {
            $(this).attr({"src":movingURL,"data-isMoving":"yes"});
        } else {
            $(this).attr({"src":stillURL,"data-isMoving":"no"});
        }
    });

    buttonMaker();
});