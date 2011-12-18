//Copyright(c)2009 tikirobot.net Software license AGPL version 3.
//inspired by the magical http://inbflat.net

// BbBuddha()
//______________________________________________________________________________
function BbBuddha() {

    this.timer      = null;
    this.numPlaying = 0;
    this.numLoaded  = 0;
    this.maxPlaying = 6;
    this.isPlaying  = false;
}

// init()
//______________________________________________________________________________
BbBuddha.prototype.init = function() {
    //console.log('init BbBuddha');

    for (var i=0; i<12; i++) {        
        $('#myytplayer'+i).get(0).addEventListener('onStateChange', 'stateChange');        
    }

    $('#loading').hide();
    $('#playButton').show();
    this.start();
}

// start()
//______________________________________________________________________________                   
BbBuddha.prototype.start = function() {
    var self   = this;
    this.startVideo();
    this.timer = setInterval(function(){self.startVideo()}, 5000);
    this.isPlaying = true;
    $('#playButton').text('Stop AutoPlay')
}

// toggle()
//______________________________________________________________________________
BbBuddha.prototype.toggle = function() {
    if (this.isPlaying) {
	this.stop();
    } else {
	this.start();
    }
}

// stop()
//______________________________________________________________________________
BbBuddha.prototype.stop = function() {
    clearInterval(this.timer);
    for (var i=0; i<12; i++) {        
        $('#myytplayer'+i).get(0).pauseVideo();        
    }
    this.isPlaying = false;
    this.numPlaying = 0;
    $('#playButton').text('Start AutoPlay')
}


// startVideo()
//______________________________________________________________________________
BbBuddha.prototype.startVideo = function() {
    if (this.numPlaying >= this.maxPlaying) {
	//console.log('numPlaying = ' + this.numPlaying + ', returning');
	return;
    }
    var vidNum =Math.floor(Math.random()*12);
    var player = $('#myytplayer'+vidNum).get(0);
    var state  = player.getPlayerState();   //state 1 == playing

    if (8 == vidNum) { //special case for spoken word
	// I love the spoken word piece, but if I leave this
	// playing all day, I hear it too often
	var rand   = Math.random();
	if (rand > 0.25) return;
    }

    if (1 != state) {
	var vol =Math.floor(Math.random()*100);
        player.setVolume(vol);
        player.playVideo();
        this.numPlaying++;
        //console.log('startVideo ' + vidNum + ' with vol = ' + vol);
    }
}



var buddha = new BbBuddha();

/////Callbacks:

// onYouTubePlayerReady()
//______________________________________________________________________________
function onYouTubePlayerReady(playerid) {
    buddha.numLoaded++;
    $('#numLoaded').text(buddha.numLoaded);
    //console.log(playerid + ' is ready');
    
    if (12 == buddha.numLoaded) {
        buddha.init();
    }
}

// stateChange()
//______________________________________________________________________________
// States:
//  -1: unstarted
//   0: ended
//   1: playing
//   2: stopped
//   3: buffering
//   5: video cued
function stateChange(newState) {

    if (0 == newState) { //some video stopped playing, update numPlaying
	var numPlaying = 0;
	var i;
	for (i=0; i<12; i++) {
	    var player = $('#myytplayer'+i).get(0);
	    var state  = player.getPlayerState();   //state 1 == playing
	    if (1 == state) {
		numPlaying++;
	    }
	}


	buddha.numPlaying = numPlaying;

	//console.log('numPlaying = ' + numPlaying);
    }
}
