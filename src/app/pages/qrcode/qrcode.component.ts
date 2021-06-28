import { Component, OnInit, ViewChild, ViewEncapsulation, } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { formatDate } from '@angular/common';
import { OrderService } from 'src/app/services/order.service';
// import { HostListener } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class QrcodeComponent implements OnInit {

  screenHeight: number;
  screenWidth: number;
  userName;
  recordRows:any;
  totalAmount:number;
  allNumber:string;
  recordDate:any;
  time:any;
  am: boolean;
  pm: boolean;
  roles:any;
  successSaved;

  @ViewChild(QrScannerComponent, {static : false}) qrScannerComponent: QrScannerComponent;

  // @HostListener('window:resize', ['$event'])
  //   getScreenSize(event?) {
  //         this.screenHeight = window.innerHeight;
  //         this.screenWidth = window.innerWidth;
  //         console.log(this.screenHeight, this.screenWidth);
  //   }

  constructor(public orderService: OrderService, public router: Router) { 
    // this.getScreenSize();
  }

  ngOnInit(): void {

    var toDay = Date.now();
    this.userName = ''; this.recordRows = []; this.totalAmount = 0;
    this.allNumber = ''; this.roles = []; this.successSaved = false;

    if (formatDate(toDay, 'a', 'en-US') == 'AM') {
      this.time = 'AM';
    } else {
      this.time = "PM";
    }
    this.recordDate = formatDate(toDay, 'yyyy-MM-dd', 'en-US');


    if (formatDate(toDay, 'a', 'en-US') == 'AM') {
      this.am = true;
    } else {
      this.pm = true;
    }

  }

  ngAfterViewInit(): void{

    this.qrScannerComponent.getMediaDevices().then(devices => {
      // console.log(devices);
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
        if (device.kind.toString() === 'videoinput') {
          videoDevices.push(device);
        }
      }
      if (videoDevices.length > 0) {
        let choosenDev;
        for (const dev of videoDevices) {
          if (dev.label.includes('front')) {
            choosenDev = dev;
            break;
          }
        }
        if (choosenDev) {
          this.qrScannerComponent.chooseCamera.next(choosenDev);
        } else {
          this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
        }
      }
    });

    this.qrScannerComponent.capturedQr.subscribe(result => {
      this.groupAsJsonData(result);
    });

  }

  groupAsJsonData(data){
    var arr = data.split(',');
    var groupArr = [];
    var number;
    var roles = [];

      arr.forEach((element, index) => {
        // console.log(element, index);
        if(index < 10){
           number = '0'+index;
        }else{
          number = ''+index;
        }

        if(Number(element) > 0){
          groupArr.push({'number':number, 'price':Number(element)});

          this.totalAmount += Number(element);
          this.allNumber += number+',';

          roles.push({
            'amount':Number(element),
            'number': number,
            'operator' : 'atae',
            'price' : element,
            'uuid' : this.getUniqueId(4),
          });
          
        }

      });

      this.recordRows = groupArr;
      this.userName = arr[100];
      
       this.roles = roles;
      // console.log(groupData);

      // console.log(arr[100]);

  }

  getUniqueId(parts: number): string {
    const stringArr = [];
    for (let i = 0; i < parts; i++) {
      // tslint:disable-next-line:no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }

  async saveAllData(){
    let data = {
      'roles': this.roles,
      'total': this.totalAmount,
      'name': this.userName,
      'date': this.recordDate
    };

    console.log(data);

    let time = {
      'am': this.am,
      'pm': this.pm
    };

    await this.orderService.saveOrder(data, time);

    this.resetData();
  }

  resetData(){
    this.successSaved = true;
    this.recordRows = [];
    this.userName = '';
    this.totalAmount = 0;
    this.roles = [];
  }

  restartScan(){
    // this.router.navigate(['qrcode']);
    window.location.reload();
  }

}
