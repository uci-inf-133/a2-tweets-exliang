var written_tweets = "";

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	written_tweets = tweet_array.filter(tweet => tweet.written); //only for completed user-written events, including activityType of "unknown"
}

function addEventHandlerForSearch() { //TODO: Search the written tweets as text is entered into the search box, and add them to the table
	//start off w/0 tweets & empty str as text
	document.getElementById("searchCount").innerHTML = 0;
	document.getElementById("searchText").innerHTML = "";

	//everytime the user types sth in text box, get that & update the text & table below
	document.getElementById("textFilter").addEventListener("input", function() {
		//update text on UI
		var search_text = this.value; //get text
		document.getElementById("searchText").innerHTML = search_text;
		var filtered_tweets = written_tweets
			.filter(tweet => tweet.writtenText.includes(search_text)
		);

		//update search count on UI
		if (search_text !== ""){
			document.getElementById("searchCount").innerHTML = filtered_tweets.length;
		} else {
			document.getElementById("searchCount").innerHTML = 0;
		}

		//update html table to display results (currently for user-written events only - so for some events that are not completed, activityType = unknown)
		var table_rows = "";
		for(var i = 0; i < filtered_tweets.length; i++){
			table_rows += filtered_tweets[i].getHTMLTableRow(i+1);
		}
		if(search_text === "") {
			document.getElementById("tweetTable").innerHTML = "";
		} else {
			document.getElementById("tweetTable").innerHTML = table_rows;
		}	
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});