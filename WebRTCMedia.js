class WebRTCMedia {
    constructor( constraints ){
        if( !webrtc.dispatcher || !WebRTCDispatcher.prototype.isPrototypeOf(webrtc.dispatcher)){
            throw new Error(
                "Could not find required dependency. " + 
                "WebRTCDispatcher is not loaded correctly. " + 
                "Make sure it is loaded before this class."
            )
        }

        this.constraints = constraints || {
            video: true,
            audio: true
        };

        this.mediaStream = null;
    }

    async init(){
        this.getStream();
    }

    async getStream(){
        try{
            this.mediaStream = await navigator.mediaDevices.getUserMedia(this.constraints);
            webrtc.dispatcher.dispatch("WebRTCMediaStreamAvailable", this.mediaStream);
        }
        catch(err){
            console.error(err);
        }
    }
}

(()=>{
    // Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  
  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
  
      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  
      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }
  
      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }
  
  if(!window.webrtc) window.webrtc = {}
  window.webrtc.media = new WebRTCMedia()
})