topics = ["Jake Peralta", "Rosa Diaz", "Terry Jeffords", "Amy Santiago", "Charles Boyle", "Gina Linetti", "Raymond Holt", "Hitchcock 99", "Scully 99", "the 99"];
var offsetValue = 0;
var topicToDisplay;
var favoriteArray = [];

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
        topicToDisplay = $(this).attr("data-name");
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=uHRSYqUJ9J8SbR9afkR7ER1ahpRP40py&q=" + topicToDisplay + "&limit=10&rating=pg";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            $("#addMore").removeAttr("class","hidden").attr("class","btn-warning");
            for (var i = 0; i < 10; i++) {
                offsetValue = 0;
                var gifDiv = $("<div class='gif float-left m-1 flex-column d-flex'>");
                var gifURL = response.data[i].images.fixed_height_still.url;
                var gifStillURL = response.data[i].images.fixed_height_still.url;
                var gifMovingURL = response.data[i].images.fixed_height.url;
                var ratingValue = response.data[i].rating;
                var IDnum = response.data[i].id;
                var ratingText = $("<p>Rating: " + ratingValue + "</p>");
                var gifImage = $("<img>").attr({"src":gifURL,"data-still":gifStillURL,"data-move":gifMovingURL,"data-isMoving":"no","class":"isAGIF","data-id":IDnum});
                var favorite = $("<button>").text("Favorite").attr({"data-favorite":"no","class":"fav-button btn-info","data-still":gifStillURL,"data-move":gifMovingURL,"data-isMoving":"no","data-id":IDnum});
                gifDiv.append(ratingText, gifImage, favorite);
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

    function addMoreGifs() {
        offsetValue += 10;
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=uHRSYqUJ9J8SbR9afkR7ER1ahpRP40py&q=" + topicToDisplay + "&limit=10&rating=pg&offset=" + offsetValue;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            for (var i = 0; i < 10; i++) {
                var gifDiv = $("<div class='gif float-left m-1 flex-column d-flex'>");
                var gifURL = response.data[i].images.fixed_height_still.url;
                var gifStillURL = response.data[i].images.fixed_height_still.url;
                var gifMovingURL = response.data[i].images.fixed_height.url;
                var ratingValue = response.data[i].rating;
                var ratingText = $("<p>Rating: " + ratingValue + "</p>");
                var IDnum = response.data[i].id;
                var gifImage = $("<img>").attr({"src":gifURL,"data-still":gifStillURL,"data-move":gifMovingURL,"data-isMoving":"no","class":"isAGIF","data-id":IDnum});
                var favorite = $("<button>").text("Favorite").attr({"data-favorite":"no","class":"fav-button btn-info","data-still":gifStillURL,"data-move":gifMovingURL,"data-isMoving":"no","data-id":IDnum});
                gifDiv.append(ratingText, gifImage, favorite);
                $("#gifLand").prepend(gifDiv);
            }
        });
    }

    function displayFavorites() {
        $("#favoriteLand").empty();
        for (var k = 0; k < favoriteArray.length; k++) {
            var gifDiv = $("<div class='gif float-left m-1 flex-column d-flex'>");
            var gifURL = favoriteArray[k].stillUrl;
            var gifStillURL = favoriteArray[k].stillUrl;
            var gifMovingURL = favoriteArray[k].movingUrl;
            var gifImage = $("<img>").attr({"src":gifURL,"data-still":gifStillURL,"data-move":gifMovingURL,"data-isMoving":"no","class":"isAGIF"});
            gifDiv.append(gifImage);
            $("#favoriteLand").prepend(gifDiv);
        }
    }

    function makeFavorite() {
        if ($(this).attr("data-favorite") == "no") {
            $(this).attr({"data-favorite":"yes","class":"fav-button btn-danger"});
            favoriteObject = {
                "id":$(this).attr("data-id"),
                "stillUrl":$(this).attr("data-still"),
                "movingUrl":$(this).attr("data-move")
            }
            favoriteArray.push(favoriteObject);
            displayFavorites();
            console.log(favoriteArray);
        } else {
            IDnum = $(this).attr("data-id");
            $(this).attr({"data-favorite":"no","class":"fav-button btn-info"});
            console.log(this);
            for (var j = 0; j < favoriteArray.length; j++) {
                if (favoriteArray[j].id == IDnum) {
                    toDeleteIndex = j;
                }
            }
            favoriteArray.splice(toDeleteIndex,1);
            displayFavorites();
            console.log(favoriteArray);
        }
        
    };
    
    $("#addMore").on("click", addMoreGifs);

    $(document).on("click", ".fav-button", makeFavorite);

    buttonMaker();
});