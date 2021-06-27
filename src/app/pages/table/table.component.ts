import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { OrderService } from 'src/app/services/order.service';
import { HostListener } from "@angular/core";
declare let html2canvas: any;

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(private orderService: OrderService) { 
    this.getScreenSize();
  }

  recordRows:any;
  date: string;
  time: string;
  recordDate:string;
  noRecords:boolean;
  screenHeight: number;
  screenWidth: number;
  search_number: any;
  searchData:boolean;
  totalAmount: number;
  capturedImage;
  allNumberRoles;

  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = window.innerHeight;
          this.screenWidth = window.innerWidth;
          // console.log(this.screenHeight, this.screenWidth);
    }

  ngOnInit(): void {

    var toDay = Date.now(); this.searchData = false; 
    this.totalAmount = 0; this.allNumberRoles = 0;

    if (formatDate(toDay, 'a', 'en-US') == 'AM') {
      this.time = 'AM';
    } else {
      this.time = "PM";
    }
    this.recordDate = formatDate(toDay, 'yyyy-MM-dd', 'en-US');

    this.searchRecord(this.recordDate+this.time);

    

  }


  async searchRecord(recordtime = null){

    this.totalAmount = 0;
    
    var collection = recordtime? recordtime : this.recordDate+this.time;
    
    var arrayRecords = await this.orderService.getRecords(collection);

    if(Object.keys(arrayRecords).length==0){
      this.noRecords = true;
    }else{
      this.noRecords = false;
    }

    var totalArr = {};

   console.log(this.totalAmount);
    
    await arrayRecords.forEach(data => {
      
      data.roles.forEach(records => {
          var arr = records.number.replace(/\s+/g, '').split(",");
          arr.forEach((number, index) => {
            if (totalArr.hasOwnProperty(number)) {
              totalArr[number] = Number(totalArr[number]) + Number(records.price);
            } else {
              totalArr[number] = Number(records.price);
            }
           
          });

      });

      this.totalAmount += Number(data.total);

    });

    this.recordRows = totalArr;
    this.allNumberRoles = 100;
  //  console.log(this.totalAmount);
  

  }

  counter(i: number) {

    // setTimeout(() => {
      return new Array(i);
    // }, 1);
      
  }

  async searchNumber(){
    
    if(!this.search_number){
      this.searchData = false;
    }else{

      this.searchData = true;

      setTimeout(() => {
        document.getElementById("row"+this.search_number).classList.remove('hidden');
      }, 1);

    }

    
  }

  downloadTotalImage() {

    html2canvas(document.querySelector("#capture")).then(canvas => {

      var link = document.createElement("a");
          document.body.appendChild(link);
          link.download = this.recordDate+this.time+".png";
          link.href = canvas.toDataURL("image/png");
          link.target = '_blank';
          link.click();

    });
  }

}
