class WebRTCDevices {
    constructor(){
        if( !webrtc.dispatcher || !WebRTCDispatcher.prototype.isPrototypeOf(webrtc.dispatcher)){
            throw new Error(
                "Could not find required dependency. " + 
                "WebRTCDispatcher is not loaded correctly. " + 
                "Make sure it is loaded before this class."
            )
        }

        this.devices = {
            cameras: {
                selected: null,
                available: {}
            },
            microphones: {
                selected: null,
                available: {}
            },
            speakers: {
                selected: null,
                available: {}
            }
        }

        this.isDevicesLoaded = false;

        this.initiateDevices();
    }

    async initiateDevices(){
        await this.updateDeviceList();
        this.isDevicesLoaded = true;

        navigator.mediaDevices.addEventListener('devicechange', async event => {
            let data = await this.updateDeviceList();
            webrtc.dispatcher.dispatch("WebRTCDevicesUpdated", data);
        });

        webrtc.dispatcher.dispatch("WebRTCDevicesLoaded", this.devices);
    }

    async updateDeviceList() {
        let selected = {
            cameras: this.devices.cameras.selected,
            microphones: this.devices.microphones.selected,
            speakers: this.devices.speakers.selected
        }
        this.devices = {
            cameras: {
                selected: null,
                available: {}
            },
            microphones: {
                selected: null,
                available: {}
            },
            speakers: {
                selected: null,
                available: {}
            }
        }

        let mediaDevices = await navigator.mediaDevices.enumerateDevices();
        mediaDevices.forEach(device => {
            console.log(device);
            var category;
            switch (device.kind) {
                case "audioinput":
                    category = this.devices.microphones;
                    break;
                case "audiooutput":
                    category = this.devices.speakers;
                    break;
                case "videoinput":
                    category = this.devices.cameras;
                    break;
                default:
                    console.warning(`Unknown media device kind detected: ${device.kind}`);
                    break;
            }

            if( category ){
                category.available[device.deviceId] = device;
                if(!category.selected || device.deviceId == selected[category]){
                    category.selected = device.deviceId;
                }
            }
        });

        return this.devices;
    }

    selectDevice(deviceId, type){
        if(this.devices[type] && this.devices[type].available[deviceId]) {
            this.devices[type].selected = deviceId;
            webrtc.dispatcher.dispatch("WebRTCSelectedDeviceChanged", {deviceId,type});
        }
    }

    getMicrophones(){
        return this.devices.microphones.available;
    }

    getCameras(){
        return this.devices.cameras.available;
    }

    getSelectedCameraId(){
        return this.devices.cameras.selected
    }

    getSelectedMicrophoneId(){
        return this.devices.microphones.selected
    }
}

(()=>{
    if(!window.webrtc) window.webrtc = {}
    window.webrtc.devices = new WebRTCDevices()
})();