exports.stream = function(next){

    var apiKey = 'l9UXjwAznY0eBFLpftzoTxLmI',                                    // api key
        apiKeySecret = '37nAZBNdXIusFjczmTOm6ZX2INxNTV2VkqAmGD1gLljErw83ot',     // api key secret
        accessToken = '3307057443-AHZEPweUTT3rk2Igbi3ZBZJfMNho22zOgpbQAq5',      // access token
        accessTokenSecret = 'OHnWcQOFk4vyius60mIrKpbTyOB3bVnV6mzBpEus1qR6l';     // access token secret

    var client = new twit({
        consumer_key: apiKey,
        consumer_secret: apiKeySecret,
        access_token: accessToken,
        access_token_secret: accessTokenSecret
    });

    
    io.sockets.on("connection", function(socket) {

        // The user it's added to the array if it doesn't exist
        if(global.users.indexOf(socket.id) === -1) {
            console.log('Socket connected for id ' + socket.id);
            global.users.push(socket.id);
        }
        
        // Listener when a user emits the "start stream" signal
        socket.on("streamon", function() {
            
            console.log('Stream state is: ' + ( global.stream != undefined) );
            // The stream will be started only when the 1st user arrives
            if(global.stream == undefined) {
                console.log('Stream up and running ...');
                console.log('Users count ' + global.users.length);
                // 401 fix: sudo ntpdate ntp.org
                global.stream = client.stream('statuses/filter', { locations: ['-180,-90,180,90'], replies: 'all' }); 
                
                global.stream.on('tweet', function(tweet) {

                    if(global.users.length > 0) {
                        
                        if(tweet.geo){

                            var formatted = {
                                retweets: tweet.retweet_count,
                                faves: tweet.favorite_count, 
                                coords: tweet.geo.coordinates, 
                                text: tweet.text,
                                user: { name: tweet.user ? tweet.user.name: null, 
                                        screenName: tweet.user ? tweet.user.screen_name: null,
                                        image: tweet.user ? tweet.user.profile_background_image_url : null  },
                                time: tweet.created_at,
                                retweeted_status: tweet.retweeted_status
                            };
                            
                            if(global.users.length == 1)
                                socket.emit("newdata", formatted); 
                            else
                                socket.broadcast.emit ("newdata", formatted); 
                        }
                    } 
                    else {
                        // If there are no users connected we destroy the stream.
                        // Why would we keep it running for nobody?
                        global.stream && stream.stop();
                        global.stream = undefined;
                    }
                });

                global.stream.on('error', function(error) {
                    throw error;
                });
            }
        });

        // This handles when a user is disconnected
        socket.on("disconnect", function(o) {

            // find the user in the array
            var index = global.users.indexOf(socket.id);

            if(index != -1) {
                // Eliminates the user from the array
                global.users.splice(index, 1);
                console.log('Socket disconnected for id ' + socket.id);
            }

            if( global.users.length == 0){
                global.stream && stream.stop();
                global.stream = undefined;
            }
        });

        // Emits signal when the user is connected sending
        // the tracking words the app it's using
        socket.emit("connected", { locations: '-180,-90,180,90' });
    });

    next && next();
}