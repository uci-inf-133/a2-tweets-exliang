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

    get activityType():string { //FIX: should change this to use regex to simplify
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type (running, skiing, biking, etc) from the text of the tweet for completed events only
        var activity_type = "";
        // Distance-based activities
        const distance_regex = /(?:completed|posted) a [\d.]+ (?:km|mi) (\w+)/i;
        const distance_match = this.text.match(distance_regex);
        if (distance_match) {
            activity_type = distance_match[1].toLowerCase(); // capture the activity
            return activity_type;
        }

        // Time-based activities
        const time_regex = /(?:completed|posted) (?:an|a) ([\w\s]+?) in /i;
        const time_match = this.text.match(time_regex);
        if (time_match) {
            activity_type = time_match[1].trim().toLowerCase();
            return activity_type;
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
        return "<tr></tr>";
    }
}

//Old activityType code:
// var start_idx = -1, end_idx = -1;

// //time activities: get start & end idxs - either "a" or "an" for start & "in" for end
// if (!this.text.includes(" km ") && !this.text.includes(" mi ")) {
//     const a_idx = this.text.indexOf(" a ");
//     const an_idx = this.text.indexOf(" an ");
//     start_idx = (a_idx !== -1) ? a_idx+3 : an_idx+3;
//     end_idx = this.text.indexOf(" in "); 
// }

// //distance activites: get start & end idxs - idx right after "km" or "mi" for start & "with" or "-" for end
// else if (this.text.includes(" km ") || this.text.includes(" mi ")) {
//     const km_idx = this.text.indexOf(" km ");
//     const mi_idx = this.text.indexOf(" mi ");
//     start_idx = (km_idx !== -1) ? km_idx+4 : mi_idx+4; //FIX: this +4 might be hardcoded
//     const with_idx = this.text.indexOf(" with ");
//     const dash_idx = this.text.indexOf(" - "); //TODO: this not fully working sometimes
//     end_idx = (dash_idx !== -1) ? dash_idx : with_idx;  //check for dash first since it's less common than with
// }

// var activity_type = "";
// if (start_idx !== -1 && end_idx !== -1) { //slice activity type from text
//     if (!this.text.includes(" km ") && !this.text.includes(" mi ")) { //not km & mi activity
//         activity_type = this.text.slice(start_idx, end_idx).trim()
//     }
//     else if (this.text.includes(" km ") || this.text.includes(" mi ")) { //km & mi activity
//         activity_type = this.text.slice(start_idx, end_idx).trim()
//     }
// }

// return activity_type;