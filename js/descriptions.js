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
	var written_tweets = tweet_array
		.filter(tweet => tweet.written) 
		.map(tweet => tweet.writtenText);
	// console.log(written_tweets)
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	//start off w/0 tweets & empty str as text
	document.getElementById("searchCount").innerHTML = 0;
	document.getElementById("searchText").innerHTML = "";

	//NEXT STEPS: everytime the user types sth in text box, get that & update the text & table below
	var curr_text = document.getElementById("textFilter").innerHTML;
	console.log(curr_text)
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});


//testng user written texts
	// for(var i = 0; i < tweet_array.length; i++){
	// 	if(tweet_array[i].written && tweet_array[i].writtenText === undefined){
	// 		console.log(tweet_array[i].text);
	// 		console.log(tweet_array[i].writtenText);
	// 	}
	// }
