class WebRTCDispatcher {
    constructor(){
        this.events = {};
    }
    
    dispatch(eventName, data){
        if( !eventName || typeof eventName !== "string"){
            console.error(`Error dispatching event: Invalid event name, must be a string of at least 1 character.`);
            return;
        }
        console.log(`Event: ${eventName} Data: ${JSON.stringify(data)}`);        
        const event = this.events[eventName];
        
        if(event){
            event.fireCallbacks(data);
        }
    }
    
    on(eventName, callback){
        if( !eventName || typeof eventName !== "string"){
            console.error(`Error registering event: Invalid event name, must be a string of at least 1 character.`);
            return;
        }
        if( !callback || typeof callback !== "function"){
            console.error(`Error registering event: Invalid callback, must be a function.`);
            return;
        }
        
        let event = this.events[eventName];
        
        if(!event){
            event = new WebRTCEvent(eventName);
            this.events[eventName] = event;
        }
        
        event.addCallback(callback);
    }
    
    off(eventName, callback){
        if( !eventName || typeof eventName !== "string"){
            console.error(`Error unregistering event: Invalid event name, must be a string of at least 1 character.`);
            return;
        }
        if( !callback || typeof callback !== "function"){
            console.error(`Error unregistering event: Invalid callback, must be a function.`);
            return;
        }
        
        let event = this.events[eventName];
        
        if(event){
            event.removeCallback(callback);
        }
    }
}

class WebRTCEvent {
    constructor(name){
        this.name = name;
        this.callbacks = [];
    }
    
    fireCallbacks(data){
        // Clone the array to protect againts mutations while running
        [...this.callbacks].forEach( callback => callback(data))
    }
    
    addCallback(callback){
        this.callbacks.push(callback);
    }
    
    removeCallback(callback){
        let index = this.callbacks.indexOf(callback);
        
        if(index > -1){
            this.callbacks.splice(index, 1);
        }
    }
}

(()=>{
    if(!window.webrtc) window.webrtc = {}
    webrtc.dispatcher = new WebRTCDispatcher()
})()
