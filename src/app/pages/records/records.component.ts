import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {

  // date: string;
  recordDate:string;
  time: string;
  recordRows: any;
  showModalBox: boolean;
  detailRows: any;
  search_number: any;
  successRows: any;
  noRecords:boolean;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {

    var toDay = Date.now(); this.showModalBox = false;

    if (formatDate(toDay, 'a', 'en-US') == 'AM') {
      this.time = 'AM';
    } else {
      this.time = "PM";
    }
    this.recordDate = formatDate(toDay, 'yyyy-MM-dd', 'en-US');

    this.searchRecord(this.recordDate+this.time);

    


  }



  showDetails(index) {
    // console.log(this.recordRows[index]);
    this.detailRows = this.recordRows[index];
    this.showModalBox = true;
  }

  hideModal() {
    this.showModalBox = false;
  }

  searchNumber() {


    this.recordRows.forEach((element, index) => {

      if (!this.search_number) {

        document.getElementById('row' + index).classList.remove("hidden","bg-green-400");

      } else {

        if (element.allNumbers.search(this.search_number) == -1) {
          document.getElementById('row' + index).className = 'hidden';
        } else {
          document.getElementById('row' + index).className = 'bg-green-400';
        }
      }

    });


  }

  async searchRecord(recordtime = null){

    var collection = recordtime? recordtime : this.recordDate+this.time;
    
    this.recordRows = await this.orderService.getRecords(collection);

    if(Object.keys(this.recordRows).length==0){
      this.noRecords = true;
    }else{
      this.noRecords = false;
    }

  }

}
