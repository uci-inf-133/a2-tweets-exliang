function parseTweets(runkeeper_tweets) { //runkeeper_tweets = arr of raw tweet objs returned from loadSavedRunkeeperTweets()
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//convert raw tweets to Tweet class instances -> an arr of tweet objs
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at); //each tweet obj has text & date/time
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	//total num of tweets

	//Part 1: Tweet Dates
	tweet_array.sort((a,b) => a.time.getTime() - b.time.getTime()) //sorts by time taking into account the date & hours (following UTC time)
	var earliest_tweet = tweet_array[0].time.toLocaleDateString("en-US", {
		year: "numeric",   
		month: "long",     
		day: "numeric",
		timeZone: "UTC"     
	});

	var latest_tweet = tweet_array[tweet_array.length - 1].time.toLocaleDateString("en-US", {
		year: "numeric",  
		month: "long",     
		day: "numeric",
		timeZone: "UTC"    
	});
	document.getElementById('firstDate').innerText = earliest_tweet;
	document.getElementById('lastDate').innerText = latest_tweet;

	//Part 1: Tweet Categories
	let live_count = 0, completed_count = 0, goal_count = 0, miscellaneous_count = 0;
	for(let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].text.includes("#RKLive")) {
			live_count++;
		} else if (tweet_array[i].text.includes("goal") || tweet_array[i].text.includes("Goal")) {
			goal_count++;
		} else if (tweet_array[i].text.includes("completed") || tweet_array[i].text.includes("posted")) {
			completed_count++;
		} else {
			miscellaneous_count++;
		}
	}
	document.querySelector('.liveEvents').innerText = live_count;
	document.querySelectorAll('.completedEvents')[0].innerText = completed_count;
	document.querySelectorAll('.completedEvents')[1].innerText = completed_count;
	document.querySelector('.achievements').innerText = goal_count;
	document.querySelector('.miscellaneous').innerText = miscellaneous_count;
	document.querySelector('.liveEventsPct').innerText = (live_count/tweet_array.length*100).toFixed(2) + '%';
	document.querySelector('.completedEventsPct').innerText = (completed_count/tweet_array.length*100).toFixed(2) + '%';
	document.querySelector('.achievementsPct').innerText = (goal_count/tweet_array.length*100).toFixed(2) + '%';
	document.querySelector('.miscellaneousPct').innerText = (miscellaneous_count/tweet_array.length*100).toFixed(2) + '%';

	// Part 1: User-Written Tweets
	let written_count = 0;
	for(let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].written) {
			written_count++;
		}
	}
	document.querySelector('.written').innerText = written_count;
	document.querySelector('.writtenPct').innerText = (written_count/completed_count*100).toFixed(2) + '%';
}

//Wait for the DOM to load (calls loadSavedRunkeeperTweets and then parseTweets)
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});