import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {

  date: string;
  time:string

  constructor() { }

  ngOnInit(): void {

    var toDay = Date.now();

    if (formatDate(toDay, 'a', 'en-US') == 'AM') {
      this.time = 'AM';
    } else {
      this.time = "PM";
    }
    this.date = formatDate(toDay, 'dd-MM-Y', 'en-US')+' '+this.time;

  }

}
