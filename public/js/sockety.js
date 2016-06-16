var sockety = (function(){

	var socket; 

	var emitMessage = function(signal) {
		if(socket) {
			socket.emit(signal);
		} else {
			console.log("Socket broken.");
		}
	};

	var newdata = function(tweet){
		
		var formatedTweet = {
			retweets: tweet.retweets,
			faves: tweet.faves, 
			longitude: helpers.formatLocation(tweet.coords).straight[0],
			latitude: helpers.formatLocation(tweet.coords).straight[1],
			text: tweet.text,
			user: tweet.user,
			time: tweet.time,
			retweeted_status: tweet.retweeted_status
		};
		
		geomaniac.tweetLocations.push(formatedTweet);
	}

	var load = function(){
		

		if(io !== undefined) {
			console.log('sockety on...');

			// Here you create the connection with the server
			socket = io.connect();

			// This will listen when the server emits the "connected" signal
			// informing to the client that the connection has been stablished
			socket.on("connected", function(r) {
				// Here the client tells the server to "start stream"
				emitMessage("streamon");
				console.log('Streaming ....');
				// This will listen to the "new tweet" signal everytime
				// there's a new tweet incoming into the stream
				socket.on("newdata", newdata);
			});

			socket.on('disconnected', function(){
				emitMessage("disconnect");
			});
		}
	};

	return {
		load: load,
		newdata: newdata
	};
})();