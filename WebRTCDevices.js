class WebRTCDevices {
    constructor(){
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

        initiateDevices();
    }

    async initiateDevices(){
        await this.updateDeviceList();
        this.isDevicesLoaded = true;

        navigator.mediaDevices.addEventListener('devicechange', event => {
            this.updateDeviceList();
        });
    }

    async updateDeviceList() {
        let mediaDevices = await navigator.mediaDevices.enumerateDevices();
        mediaDevices.forEach(device => {
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
                if(!category.selected){
                    category.selected = device.deviceId;
                }
            }
        });
    }
}