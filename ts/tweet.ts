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
        var new_text = this.text.replace(/https?:\/\/\S+/g, ''); //removes URLs
        new_text = new_text.replace(/#Runkeeper/g, ''); //removes #Runkeeper
        if (!new_text.includes("Check it out!")){ //not user written ("@RunKeeper" also means not user written but "-" means user written)
            return true;
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet 
        if (!this.text.includes(" - ")){ //handle tweets that are fully user written so there's no "-"
            return this.text
        }
        var written_text = this.text.split(" - ")[1]; //after the "-" is user written text
        return written_text;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type (running, skiing, biking, etc) from the text of the tweet for completed events only
        let activity_type = "";

        // Match distance-based activities like "completed a 5 km run"
        const distance_regex = /(?:completed|posted)\s+(?:an|a)?\s*[\d.]+\s*(?:km|mi)\s+([a-zA-Z]+)/i;
        const distance_match = this.text.match(distance_regex);

        if (distance_match) {
            activity_type = distance_match[1].toLowerCase();
        } else {
            // Match time-based activities like "completed an elliptical workout in 30 minutes"
            const time_regex = /(?:completed|posted)\s+(?:an|a)?\s*([\w\s®/]+?)(?:\s+(?:workout|session|activity|practice|exercise))?\s+(?:in|for)/i;
            const time_match = this.text.match(time_regex);
            if (time_match) {
                activity_type = time_match[1].trim().toLowerCase();
            }
        }

        //remove filler suffixes like workout, session, activity, practice, & exercise
        activity_type = activity_type.replace(/\b(workout|session|activity|practice|exercise)\b/g, "").trim();

        //replace multiple spaces with one
        activity_type = activity_type
            .replace(/[®&]/g, "")          //remove symbols
            .replace(/\s*\/\s*/g, " ")     //replace slashes with space
            .replace(/\b(workout|session|activity|practice|exercise)\b/g, "")
            .replace(/\s{2,}/g, " ")
            .trim();

        const corrections: Record<string, string> = {  //normalize specific known phrases and typos
            "elliptical": "elliptical workout",
            "mysports freestyle": "mysports freestyle",
            "mysports": "mysports freestyle", //for mysports freestyle which counts as both time & distance activities
            "mysports gym": "mysports gym",
            "mtn": "mtn bike",
            "chair": "chair ride",
            "barre": "barre",
            "circuit": "circuit workout",
            "spinning": "spinning workout",
            "bootcamp": "bootcamp",
            "yoga": "yoga",
            "pilates": "pilates session",
            "strength": "strength workout",
            "core": "core workout",
            "row": "row",
            "run": "run",
            "walk": "walk",
            "bike": "bike",
            "hike": "hike",
            "crossfit": "crossfit workout",
            "stairmaster stepwell": "stairmaster/stepwell",
            "boxing mma": "boxing/mma",
            "group": "group workout",
            "nordic": "nordic walk",
            "ski": "ski run",
        };

        if (corrections[activity_type]) {  // apply correction if exists
            activity_type = corrections[activity_type];
        }

        return activity_type;
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: parse the distance (convert all to mi) from the text of the tweet (for completed tweets only)
        if ((this.text.includes("completed") || this.text.includes("posted"))
            && (this.text.includes(" km ") || this.text.includes(" mi "))){ //all completed tweets hv a distance in km or mi
            const regex = /(?:posted|completed) a (\d+(\.\d+)?) (km|mi)/i; //start: "posted a" or "completed a", end: "km" or "mi"
            const match = this.text.match(regex);
            if (match) {
                let distance = parseFloat(match[1]); // captured number
                let unit = match[3]; // "km" or "mi"
                if (unit === "km") { // convert to miles if needed
                    distance *= 0.62150404;
                } 
                return distance;
            }
        }
        return -1; //default for time based acitivities (shouldn't hit)
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        var tweet_with_link = this.text.replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank">$1</a>');
        return `<tr>
                    <td>${rowNumber}</td>
                    <td>${this.activityType}</td>
                    <td>${tweet_with_link}</td>
                </tr>`;
    }
}