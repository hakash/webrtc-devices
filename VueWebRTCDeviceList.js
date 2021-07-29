
const WebRtcDevicePicker = {
    props: ['fetchDevices'],
    data(){
        return {
            devices: {}
        }
    },
    mounted(){
        console.log(this.fetchDevices)
        if( webrtc.devices.isDevicesLoaded ) {
            this.devices = this.fetchDevices();
        }
        else {
            webrtc.dispatcher.on('WebRTCDevicesLoaded', event => {
                console.log(this.fetchDevices)
                this.devices = this.fetchDevices();
            });
        }

        webrtc.dispatcher.on('WebRTCDevicesUpdated', event => {
            this.devices = this.fetchDevices();
        });
    },
    template: `<select>
        <webrtc-device-option 
            v-for="option in devices" 
            v-bind:device="option"
            v-bind:key="option.deviceId"
        ></webrtc-device-option>
    </select>`
}

const app = Vue.createApp(WebRtcDevicePicker)

app.component('webrtc-device-option', {
    props: ['device'],
    template: `<option value="{{device.deviceId}}">{{device.label}}</option>`
})

app.mount('#webrtc-device-picker');