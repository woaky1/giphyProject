// Setting up some initial global variables and our initial set of topic buttons.
topics = ["Jake Peralta", "Rosa Diaz", "Terry Jeffords", "Amy Santiago", "Charles Boyle", "Gina Linetti", "Raymond Holt", "Hitchcock 99", "Scully 99", "the 99"];
var offsetValue = 0;
var topicToDisplay;
var favoriteArray = [];

$(document).ready(function(){
    // This function creates the topic buttons that appear at the top of the page.
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
    // This is a event listener that takes into fed into the new topic form and then feeds that info into the buttonMaker function
    $("#add-topic").on("click", function(event) {
        event.preventDefault();
        var newTopic = $("#topic-input").val().trim();
        topics.push(newTopic);
        buttonMaker();
    });

    // This fuctiion takes data we got from the topic button and sends it to the API to get our gif information. We then, in turn, use that dats to generate new divs containing those gifs, favorite buttons associated with them, etc.
    function displayGifs() {
        topicToDisplay = $(this).attr("data-name");
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=uHRSYqUJ9J8SbR9afkR7ER1ahpRP40py&q=" + topicToDisplay + "&limit=10&rating=pg";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
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

    // This is an event listener checking to see if a user has clicked a topic button.
    $(document).on("click", ".99-btn", displayGifs);

    // This is an event listener checking to see if the user has clicked a gif, and then toggling the moving image of the gif on and off.
    $(document).on("click",".isAGIF", function() {
        var playingYet = $(this).attr("data-isMoving");
        var stillURL = $(this).attr("data-still");
        var movingURL = $(this).attr("data-move");
        if(playingYet == "no") {
            $(this).attr({"src":movingURL,"data-isMoving":"yes"});
        } else {
            $(this).attr({"src":stillURL,"data-isMoving":"no"});
        }
    });

    // This function requests and displays more gifs. Very similar to displayGifs, except it incorportates offset into the API call so we don't get the same 10 gifs.
    function addMoreGifs() {
        offsetValue += 10;
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=uHRSYqUJ9J8SbR9afkR7ER1ahpRP40py&q=" + topicToDisplay + "&limit=10&rating=pg&offset=" + offsetValue;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
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

    // This function displays the the gifs marked as favorites in the favorite gif section. Similar to diplayGifs, except without the API call and with less data being set.
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

    // This function lets us set a gif is a favorite (and remove it from favorites if it gets clicked again.)
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
        } else {
            IDnum = $(this).attr("data-id");
            $(this).attr({"data-favorite":"no","class":"fav-button btn-info"});
            for (var j = 0; j < favoriteArray.length; j++) {
                if (favoriteArray[j].id == IDnum) {
                    toDeleteIndex = j;
                }
            }
            favoriteArray.splice(toDeleteIndex,1);
            displayFavorites();
        }
        
    };
    
    // This is an event listener to see if the user has clicked the "Add more gifs" button, and runs the addMoreGifs function if they do.
    $("#addMore").on("click", addMoreGifs);

    // This is an event listener to see if the use has clicked a favorite button, and runs the makeFavorite if they do.
    $(document).on("click", ".fav-button", makeFavorite);

    // Here we call buttonMaker so we can populate the initial set of buttons when the page first loads.
    buttonMaker();
});