function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.


	//TESTING for Part 2: Determining activity type and distance
	// for(let i = 0; i < 100; i++) {
	// 	console.log(tweet_array[i].text);
	// }

	//get the type of physical activity 
	// for(let i = 0; i < 100; i++) { //km or mi
	// 	console.log(tweet_array[i].text + " & " + tweet_array[i].activityType.toUpperCase());
	// }

	/*edge cases:
	- Just posted a MySports Freestyle in 1:01:28  - TomTom MySports Watch https://t.co/tv6pKRfYRo #Runkeeper & JUST
	- Just posted a spinning workout in 1:00:00  with @Runkeeper. Check it out! https://t.co/BxDNWVU2rr #Runkeeper & JUST
	*/

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});


//Part 2: determining distance
// for(let i = 0; i < 100; i++) { //distance
// 	if (tweet_array[i].text.includes("completed")){ // || tweet_array[i].text.includes("posted")
// 		console.log(tweet_array[i].text + " & " + tweet_array[i].distance);
// 	}
// 	if (tweet_array[i].text.includes("posted") && (tweet_array[i].text.includes("km") || tweet_array[i].text.includes("mi"))){ // || tweet_array[i].text.includes("posted")
// 		console.log(tweet_array[i].text + " & " + tweet_array[i].distance);
// 	}
// }