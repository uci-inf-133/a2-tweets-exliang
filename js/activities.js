function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//Part 2: Determining activity type and distance
	let activity_counts = {} //for storing diff types of activities & their counts
	for(let i = 0; i < tweet_array.length; i++){
		if (tweet_array[i].source === "completed_event"){ //completed events only
			if (!activity_counts[tweet_array[i].activityType]) {
				activity_counts[tweet_array[i].activityType] = 1;
			}
			else {
				activity_counts[tweet_array[i].activityType] += 1;
			}
		}
	}

	let sorted_activities = Object.fromEntries(Object.entries(activity_counts).sort((a, b) => b[1] - a[1])); //sort the dict by counts descending
	var top_3_activities = Object.keys(sorted_activities).slice(0, 3); //get top 3 most logged activities
	document.getElementById('numberActivities').innerHTML = Object.keys(activity_counts).length; //number of types of activities
	document.getElementById('firstMost').innerHTML = top_3_activities[0];
	document.getElementById('secondMost').innerHTML = top_3_activities[1];
	document.getElementById('thirdMost').innerHTML = top_3_activities[2];

	//finding longest & shortest distance activities from the top 3 activities
	var max_distance = 0, min_distance = 2 ** 53 - 1;
	var max_activity = "", min_activity = "";
	for(let i = 0; i < tweet_array.length; i++){
		//completed events & distance activities only
		if (tweet_array[i].source === "completed_event" && (tweet_array[i].text.includes(" km ") || tweet_array[i].text.includes(" mi "))){
			var curr_distance = tweet_array[i].distance;
			var curr_activity = tweet_array[i].activityType;
			if (top_3_activities.includes(curr_activity)){ //only account for the top 3 activites
				if (curr_distance > max_distance){
					max_distance = curr_distance;
					max_activity = curr_activity;
				}
				else if (curr_distance < min_distance){
					min_distance = curr_distance;
					min_activity = curr_activity;
				}
			}
		}
	}
	document.getElementById('longestActivityType').innerHTML = max_activity;
	document.getElementById('shortestActivityType').innerHTML = min_activity;

	//finding the day the longest distance activity is on
	var days_n_distances = {} //dict w (day,total distance) pair
	days_n_distances[0] = 0, days_n_distances[1] = 0, days_n_distances[2] = 0, days_n_distances[3] = 0, days_n_distances[4] = 0, days_n_distances[5] = 0, days_n_distances[6] = 0 //Sunday - Saturday

	for(let i = 0; i < tweet_array.length; i++){ //completed event & distance ones only
		if (tweet_array[i].source === "completed_event" && (tweet_array[i].text.includes(" km ") || tweet_array[i].text.includes(" mi "))){
			var day = new Date(tweet_array[i].time.toLocaleDateString("en-US")).getDay();
			days_n_distances[day] += tweet_array[i].distance;
		}
	}

	//avg activities on wkdys & wknds 
	var total_wkdy_distances = days_n_distances[1] + days_n_distances[2] + days_n_distances[3] + days_n_distances[4] + days_n_distances[5];
	var total_wknd_distances = days_n_distances[0] + days_n_distances[6];
	var wkdy_avg = total_wkdy_distances / 5;
	var wknd_avg = total_wknd_distances / 2;
	var longer_activity_days = wkdy_avg > wknd_avg ? "weekdays" : "weekends";
	document.getElementById('weekdayOrWeekendLonger').innerHTML = longer_activity_days;

	//Part 2: Graphing activities by distance
	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	
	console.log(sorted_activities) //FIX: eliptical & eliptical workout listed - need to combine!!!!!
	var activity_data = Object.entries(sorted_activities).map(([type, count]) => {
  		return { activity_type: type, count: count };
	});
	console.log(activity_data)

	activity_vis_spec = { //TODO: Add mark and encoding
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": { "values": activity_data},
		"mark": "bar",
		"encoding": {
			"x": {
				"field": "activity_type",
				"type": "nominal",
				"title": "Activity Type"
			},
			"y": {
				"field": "count",
				"type": "quantitative",
				"title": "Activity Count",
				"scale": { "type": "linear" }, 
			},
			"color": { 
				"field": "activity_type",
				"type": "nominal",
				"legend": null
			}
		},
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});


//Part 2: determining distance
// for(let i = 0; i < 100; i++) { //distance
// 	if (tweet_array[i].text.includes("completed") || tweet_array[i].text.includes("posted")){ // || tweet_array[i].text.includes("posted")
// 		if (tweet_array[i].distance > 0) { //only print if distance activity
// 			console.log(tweet_array[i].text + " & " + tweet_array[i].distance);
// 		}
// 	}
// }

//Part 2: determining activity type
// for(let i = 0; i < 8247; i++) { //activity type
// 	if (tweet_array[i].text.includes("completed") || tweet_array[i].text.includes("posted")){ //completed events only
// 		if(tweet_array[i].text.includes(" km ") || tweet_array[i].text.includes(" mi ")) { //km & mi types
// 			if (tweet_array[i].activityType == "unknown"){ //TODO: why are there unknowns when it's fs completed events only? some events are achievements since thats checked before
// 				console.log(tweet_array[i].text + " 😭 " + tweet_array[i].activityType); //tweet_array[i].text + " 😭 " +
// 			} 
// 		}
// 		// if(!tweet_array[i].text.includes("km") && !tweet_array[i].text.includes("mi")) { //km & mi types
// 		// 	console.log(tweet_array[i].activityType);
// 		// }
// 	}
// }

//TESTING for Part 2: Determining activity type and distance
// for(let i = 0; i < 100; i++) {
// 	console.log(tweet_array[i].text);
// }

//get the type of physical activity 
// for(let i = 0; i < 100; i++) { //km or mi
// 	console.log(tweet_array[i].text + " & " + tweet_array[i].activityType.toUpperCase());
// }

/*all cases:
- Just posted a "MySports Freestyle" in 1:01:28  - TomTom MySports Watch https://t.co/tv6pKRfYRo #Runkeeper & JUST
- Just posted a "spinning workout" in 1:00:00  with @Runkeeper. Check it out! https://t.co/BxDNWVU2rr #Runkeeper & JUST
- Just posted a "meditation" in 21:00  with @Runkeeper

- I just completed an activity with Runkeeper https://t.co/CpO35to5Oc (maybe need to make compeleted events exlcude this?)

- Just posted a spinning workout in 45:00 VS Just posted a bike in 1:00:38 - take everyting from after idx "a" or "an" to before "in"
- Just posted an activity in 1:44:59  with @Runkeeper. - just keep as "activity"
*/

// //CHECK: verify by creating a distances
// let distances = [];

// for (let tweet of tweet_array) {
// 	if (tweet.source === "completed_event") {
// 		let dist = tweet.distance; // assuming your distance getter works
// 		if (dist > 0) distances.push(dist);
// 	}
// }

// // Find max and min
// let maxDistance = Math.max(...distances);
// let minDistance = Math.min(...distances);

// console.log("Max distance:", maxDistance);
// console.log("Min distance:", minDistance);