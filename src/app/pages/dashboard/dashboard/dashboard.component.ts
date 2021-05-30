import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { OrderService } from 'src/app/services/order.service';
// import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

// declare var require:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  dataForm = new FormGroup({
    am : new FormControl(''),
    pm : new FormControl(''),
    name: new FormControl('', Validators.required),
    date : new FormControl('', Validators.required),
    numbers : new FormControl('', Validators.required),
    operator : new FormControl('', Validators.required),
    price : new FormControl('', Validators.required),
  });

  sign:string;

  constructor(public  orderService : OrderService) { }


  ngOnInit(): void {

  var toDay = Date.now();
    
  this.dataForm.controls['date'].setValue(formatDate(toDay, 'yyyy-MM-dd', 'en-US'));

    if( formatDate(toDay, 'a', 'en-US') == 'AM'){
      this.dataForm.controls['am'].setValue(true);
    }else{
      this.dataForm.controls['pm'].setValue(true);
    }
  
    
  }

  numberFunction(number){

    if(this.dataForm.controls['operator'].value != ''){
      this.dataForm.controls['price'].patchValue(this.dataForm.controls['price'].value+number);
    }else{
      this.dataForm.controls['numbers'].patchValue(this.dataForm.controls['numbers'].value+number);
    }

    

  }

  operatorFunction(operator, sign){

    var cloneSign = sign.target.firstChild.cloneNode(true);

    document.getElementById('displayBox').innerHTML = '';

    document.getElementById('displayBox').appendChild(cloneSign);

    this.dataForm.controls['operator'].setValue(operator);


  }

  clearFunction(){

    // console.log(this.dataForm.value.price.length);

    let price = this.dataForm.value.price;
    let operator = this.dataForm.value.operator;
    let number = this.dataForm.value.numbers;


    if(price.length > 0){

      price = price.substring(0, price.length - 1);
      this.dataForm.controls['price'].setValue(price);

    }else if(operator){

      this.dataForm.controls['operator'].setValue('');
      document.getElementById('displayBox').innerHTML = '';

    }else if(number){
      
      number = number.substring(0, number.length - 1);
      this.dataForm.controls['numbers'].setValue(number);

    }


  }

  confirmOrder(){

    // console.log(this.dataForm.value, 'ok');

    var data:any;

    switch (this.dataForm.value.operator) {
      case "atae":

      // console.log(this.dataForm.value);

      // data = {
      //   this.dataForm.value.numbers : this.dataForm.value.numbers,
      // }

        this.orderService.postOrder(this.dataForm.value);

        this.clearForm();

        break;

      case "apyan":

        // console.log([...this.dataForm.value.numbers]);

        this.orderService.apyanPostOrder(this.dataForm.value);
        this.clearForm();

        break;

      case "":

        break;
    
      default:
        break;
    }

  }

  clearForm(){
    this.dataForm.controls['price'].setValue('');
    this.dataForm.controls['numbers'].setValue('');
    this.dataForm.controls['operator'].setValue('');
    document.getElementById('displayBox').innerHTML = '';
  }

}
