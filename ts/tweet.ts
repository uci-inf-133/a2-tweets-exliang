class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.

        /* Part 1: Tweet Categories
        Live = person tweets while they're currently doing the acitivty ("#RKLive")
        
        Achievement = person indicates an achivement they reached or a goal they set ("goal" or "Goal")
        - Just completed a 8.65 mi run - Goal was 9. Oh well
        - I just set a goal on #Runkeeper!

        Completed = person tweets acitvity they recently finished ("completed")

        Miscellaneous = anything that didn't involve posting abt an activity
        */
        if (this.text.includes("#RKLive")) {
            return "live_event";
        }
        else if (this.text.includes("goal") || this.text.includes("Goal")) {
            return "achievement";
        }
        else if (this.text.includes("completed") || this.text.includes("posted")) {
            return "completed_event";
        }
        else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        this.text = this.text.replace(/https?:\/\/\S+/g, ''); //removes URLs
		this.text = this.text.replace(/#Runkeeper/g, ''); //removes #Runkeeper
        // ends with "Check it out!" or an auto hashtag #RunKeeper #RKLive #RKPodcast #FitnessAlerts #RunkeeperLive #RunKeeperApp
        if (this.text.includes("Check it out!") || this.text.includes("#RunKeeper") || this.text.includes("#RKLive") || this.text.includes("#RKPodcast") || this.text.includes("#FitnessAlerts") || this.text.includes("#RunkeeperLive") || this.text.includes("#RunKeeperApp")) {
            return false;
        }
        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet 
        var written_text = this.text.split(" - ")[1]; //after the "-" is user written text
        return written_text;
    }

    get activityType():string { //FIX
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type (running, skiing, biking, etc) from the text of the tweet
        var words_list = this.text.split(" ")
        var start_idx;
        if (words_list.includes("km")) {
            start_idx = words_list.indexOf("km");
        }
        else {
            start_idx = words_list.indexOf("mi");
        }
        var activity = words_list[start_idx + 1]; //activity is the word after the distance unit
        return activity;
  
        
        //end idxs
        // const with_idx = this.text.indexOf(" with");
        // const dash_idx = this.text.indexOf(" -");

    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: parse the distance (convert all to mi) from the text of the tweet (for completed tweets only)
        if (this.text.includes("completed")){ //all completed tweets hv a distance in km or mi
            var words = this.text.split(" ")
            if (words[4] == "km") {
                return parseFloat(words[3]) * 0.62150404; //convert km to mi
            }
            else if (words[4] == "mi") {
                return parseFloat(words[3]);
            }

        }
        else if (this.text.includes("posted")){
            var words = this.text.split(" ")
            if (words[4] == "km") {
                return parseFloat(words[3]) * 0.62150404; //convert km to mi
            }
            else if (words[4] == "mi") {
                return parseFloat(words[3]);
            }
        }
        return 0; //default
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}