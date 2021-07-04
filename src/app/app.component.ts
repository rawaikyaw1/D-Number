import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'dNumber';
  deviceInfo = null;
  user: any;
  // update:boolean = false;

  constructor(updates: SwUpdate, private deviceService: DeviceDetectorService) {
    updates.available.subscribe(event => {
      // this.update=true;

      updates.activateUpdate().then(() => document.location.reload());

    });

    this.epicFunction();
  }

  async epicFunction() {

    this.deviceInfo = this.deviceService.getDeviceInfo();
    // const isMobile = this.deviceService.isMobile();
    // const isTablet = this.deviceService.isTablet();
    // const isDesktopDevice = this.deviceService.isDesktop();
    // console.log(this.deviceInfo);
    // console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    // console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.

    // localStorage.setItem('user', 'good');

    // if (isMobile) {
    //   localStorage.setItem('device_type', 'Mobile');
    // } else if (isTablet) {
    //   localStorage.setItem('device_type', 'Tablet');
    // } else if (isDesktopDevice) {
    //   localStorage.setItem('deviceType', 'Computer Browser');
    // }

    await localStorage.setItem('deviceInfo', JSON.stringify(this.deviceInfo));


  }



}
