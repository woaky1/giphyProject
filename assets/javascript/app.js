topics = ["Jake Peralta", "Rosa Diaz", "Terry Jeffords", "Amy Santiago", "Charles Boyle", "Gina Linetti", "Raymond Holt", "Michael Hitchcock", "Norm Scully", "the 99"];

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
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=uHRSYqUJ9J8SbR9afkR7ER1ahpRP40py&q=" + topicToDisplay + "&limit=10";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            for (var i = 0; i < 10; i++) {
                var gifDiv = $("<div class='gif'>");
                var gifURL = response.data[i].images.fixed_height_still.url;
                var gifImage = $("<img>").attr("src",gifURL);
                gifDiv.append(gifImage);
                $("#gifLand").prepend(gifDiv);
            }
        });
    };

    $(document).on("click", ".99-btn", displayGifs);

    buttonMaker();
});