import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { OrderService } from 'src/app/services/order.service';

declare var require: any;
var toastr = require('toastr');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  number: string;
  operator: string;
  price: string;
  date: string;
  am: boolean;
  pm: boolean;
  name: string;
  totalAmount: number;
  cloneSign: any;
  editRowId: any;

  tableRow = [];

  constructor(public orderService: OrderService) { }

  ngOnInit(): void {

    var toDay = Date.now();
    this.number = ""; this.operator = ""; this.price = ""; this.totalAmount = 0;
    this.date = formatDate(toDay, 'yyyy-MM-dd', 'en-US');
    this.editRowId = false;

    // localStorage.setItem("tableRowData", JSON.stringify([]));
    // localStorage.setItem("totalAmount", JSON.stringify(0));

    this.tableRow = localStorage.getItem("tableRowData") ? JSON.parse(localStorage.getItem("tableRowData")) : [];

    this.totalAmount = localStorage.getItem('totalAmount') ? Number(JSON.parse(localStorage.getItem("totalAmount"))) : 0;

    // this.tableRow = [];
    // this.totalAmount = 0;


    if (formatDate(toDay, 'a', 'en-US') == 'AM') {
      this.am = true;
    } else {
      this.pm = true;
    }

  }

  changeDate(value) {
    // console.log(value.target.value);
    this.date = value.target.value;
  }

  numberFunction(number) {

    if (!this.operator) {

      this.number += number;

    } else {

      this.price += number;

    }

    // console.log(this.price, this.number, this.date);

  }

  operatorFunction(operator, sign) {

    this.cloneSign = sign.target.firstChild.cloneNode(true);

    document.getElementById('operatorbox').innerHTML = '';

    document.getElementById('operatorbox').appendChild(this.cloneSign);

    this.operator = operator;

  }

  clearFunction(all = null) {

    if (all) {

      this.price = ''; this.number = ''; this.operator = '';
      document.getElementById('operatorbox').innerHTML = '';

      this.editRowId = null;

    } else {
      if (this.price) {

        this.price = this.price.substring(0, this.price.length - 1);

      } else if (this.operator) {

        document.getElementById('operatorbox').innerHTML = '';
        this.operator = '';

      } else if (this.number) {

        this.number = this.number.substring(0, this.number.length - 1);

      }
    }

  }

  async confirmFunction() {

    let insertData:any;

    switch (this.operator) {

      // Start Atae condition
      case 'atae':
        insertData = await this.ataeFunction();
        break;
      //Start Atae conditon

      // Start အပြန် condition
      case 'apyan':
        insertData = await this.apyanFunction();
        break;
      // End အပြန် condition

      // Start ပတ်လှည့် condition
      case 'patlal':
        insertData = await this.patlalFunction();
        break;
      //End ပတ်လှည့် condition

      // Start Net Khat condition
      case 'netkhat':
        insertData = await this.netkhatFunction();
        break;
      //End Net Khat condition

      // Start Power condition
      case 'power':
        insertData = await this.powerFunction();
        break;
      // End power condition

      // Start Apuu condition
      case 'apuu':
        insertData = await this.apuuFunction();
        break;
      // End Apuu condition

      // Start Apwint condition.
      case "apwint":
        insertData = await this.apwintFunction();
        break;
      // End Apwint condition.

      // Start Nyi Ko condition
      case 'nyiko':
        insertData = await this.nyikoFunction();
        break;
      // End Nyi Ko condition
    }

    if(insertData){
      this.addToTableData(insertData, insertData['amount']);
    }

  }

  ataeFunction() {

    var arr = [...this.number];

    if (!this.price || !this.number || arr.length < 2 || arr.length > 2) {

      toastr.error('Invalid data input.', 'Invalid!');
      return false;

    }

    let uuidAtae = this.getUniqueId(4);

    let row = {
      'uuid': uuidAtae,
      'number': this.number,
      'operator': this.operator,
      'price': this.price,
      'amount': this.price,
      'originNumber': this.number
    };

    return row;

  }

  async apyanFunction() {
    if (!this.price || !this.number) {

      toastr.error('Invalid data input.', 'Invalid!');
      return false;

    }

    let uuidApyan = this.getUniqueId(4);

    var arr = [...this.number];
    let group = [];
    let price = this.price;
    let groupNumber = '';

    for (let check = 0; check < arr.length; check++) {

      groupNumber = await this.calculationNumber(check, arr, group, price, groupNumber) + ', '.slice(0, -2);

    }

    if (group.length == 0) {
      toastr.error('Invalid numbers input.', 'Invalid!');
      return false;
    }

    // console.log(groupNumber);

    let aPyanPrice = group.length * Number(this.price);

    let rowApyan = {
      'uuid': uuidApyan,
      'number': groupNumber.slice(0, -2),
      'operator': this.operator,
      'price': this.price,
      'amount': aPyanPrice,
      'originNumber': this.number
    };

    return rowApyan;

  }

  async patlalFunction() {

    if (!this.price || !this.number) {

      toastr.error('Invalid data input.', 'Invalid!');
      return false;

    }

    let uuidPatLal = this.getUniqueId(4);

    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let patLalNumbers = '';

    var arr = [...this.number];
    var matchNumbersArr = [];

    arr.forEach(inputNumber => { // loop for input number
      numbers.forEach(roundNumber => { // loop for round numbers

        let groupArr = [inputNumber + '' + roundNumber, roundNumber + '' + inputNumber];
        matchNumbersArr = [...matchNumbersArr, ...groupArr];

      });
    });


    matchNumbersArr = await matchNumbersArr.filter(function (elem, index, self) {

      if (index === self.indexOf(elem)) {
        patLalNumbers += elem + ", ";
      }

      return index === self.indexOf(elem);

    });

    let patLalPrice = matchNumbersArr.length * Number(this.price);

    let rowPatLal = {
      'uuid': uuidPatLal,
      'number': patLalNumbers.slice(0, -2),
      'operator': this.operator,
      'price': this.price,
      'amount': patLalPrice,
      'originNumber': this.number
    };

    return rowPatLal;

  }

  async netkhatFunction(){

    let uuidNetKhat = this.getUniqueId(4);
    let netKhatNumbers = "";
    let netKhatPrice = 0;

    if (!this.price) {

      toastr.error('Invalid data input.', 'Invalid!');
      return false;

    }

    if (!this.number) {

      netKhatPrice = 10 * Number(this.price);

      netKhatNumbers = '07, 70, 18, 81, 24, 42, 35, 53, 69, 96, ';

    } else {

      let netKhatNumberArr = ['07', '70', '18', '81', '24', '42', '35', '53', '69', '96'];

      var arr = [...this.number];
      var matchNumbersArr = [];

      arr.forEach(e => {

        let findNumbers = netKhatNumberArr.filter(arrBirds => arrBirds.includes(e));

        matchNumbersArr = [...matchNumbersArr, ...findNumbers];

      });

      matchNumbersArr = await matchNumbersArr.filter(function (elem, index, self) {

        if (index === self.indexOf(elem)) {
          netKhatNumbers += elem + ", ";
        }

        return index === self.indexOf(elem);

      });

      netKhatPrice = matchNumbersArr.length * Number(this.price);

    }

    let rowNetKhat = {
      'uuid': uuidNetKhat,
      'number': netKhatNumbers.slice(0, -2),
      'operator': this.operator,
      'price': this.price,
      'amount': netKhatPrice,
      'originNumber': this.number
    };

    return rowNetKhat;

  }

  async powerFunction(){
    let powerNumbers = "";
      let uuidPower = this.getUniqueId(4);
      let powerPrice;

      if (!this.price) {

        toastr.error('Invalid data input.', 'Invalid!');
        return false;

      }

      if (!this.number) {

        powerNumbers = '05, 50, 16, 61, 27, 72, 38, 83, 49, 94, ';
        powerPrice = 10 * Number(this.price);


      } else {

        let powerNumbersArr = ['05', '50', '16', '61', '27', '72', '38', '83', '49', '94'];

        var arr = [...this.number];

        var matchNumbersArr = [];

        arr.forEach(e => {

          let findNumbers = powerNumbersArr.filter(arrBirds => arrBirds.includes(e));

          matchNumbersArr = [...matchNumbersArr, ...findNumbers];

        });

        //remove duplicate array value
        matchNumbersArr = await matchNumbersArr.filter(function (elem, index, self) {

          if (index === self.indexOf(elem)) {
            powerNumbers += elem + ", ";
          }

          return index === self.indexOf(elem);

        });

        powerPrice = matchNumbersArr.length * Number(this.price);

      }

      let rowPower = {
        'uuid': uuidPower,
        'number': powerNumbers.slice(0, -2),
        'operator': this.operator,
        'price': this.price,
        'amount': powerPrice,
        'originNumber': this.number
      };

    return rowPower;
  }

  async apuuFunction(){

    let uuidApuu = this.getUniqueId(4);
        let apuuNumbers = '';
        let apuuNumbersArr = [];
        let apuuPride = 0;

        if (!this.price) {

          toastr.error('Invalid data input.', 'Invalid!');
          return false;

        }

        if (this.number) {

          let arr = [...this.number];

          arr.forEach(element => {

            apuuNumbersArr = [...apuuNumbersArr, ...[element + '' + element]];

            apuuNumbers += element + '' + element + ', ';

          });


        } else {

          apuuNumbersArr = ['11', '22', '33', '44', '55', '66', '77', '88', '99', '00'];
          apuuNumbers = '11, 22, 33, 44, 55, 66, 77, 88, 99, 00, ';

        }

        apuuPride = apuuNumbersArr.length * Number(this.price);

        let rowApuu = {
          'uuid': uuidApuu,
          'number': apuuNumbers.slice(0, -2),
          'operator': this.operator,
          'price': this.price,
          'amount': apuuPride,
          'originNumber': this.number
        };

    return rowApuu;

  }

  async apwintFunction(){
    let uuidApwint = this.getUniqueId(4);

    if (!this.number || !this.price) {

      toastr.error('Invalid data input.', 'Invalid!');
      return false;

    }

    var arr = [...this.number];
    var apwintArr = [];
    var apwintNumbers = '';

    if (arr.length > 1) {

      for (let i = 0; i < 100; i++) {

        let number = (i < 10 ? '0' + i : i.toString());

        var numberArr = [...number];
        var sumNumber = Number(numberArr[0]) + Number(numberArr[1]);

        // console.log(sumNumber);
        if (sumNumber == Number(this.number)) {

          apwintArr = [...apwintArr, ...[number]];
          apwintNumbers += number + ', ';

        }

      }

    } else {

      arr.forEach(element => {

        for (let i = 0; i < 100; i++) {

          let number = (i < 10 ? '0' + i : i.toString());

          var plusElement = Number(element) + 10;
          var numberArr = [...number];
          var sumNumber = Number(numberArr[0]) + Number(numberArr[1]);

          // console.log(sumNumber);
          if (sumNumber == Number(element) || sumNumber == plusElement) {

            apwintArr = [...apwintArr, ...[number]];
            apwintNumbers += number + ', ';

          }

        }

      });

    }

    let apwintPrice = apwintArr.length * Number(this.price);

    let rowApwint = {
      'uuid': uuidApwint,
      'number': apwintNumbers.slice(0, -2),
      'operator': this.operator,
      'price': this.price,
      'amount': apwintPrice,
      'originNumber': this.number
    };

    return rowApwint;
  }

  async nyikoFunction(){

    if (!this.price) {

      toastr.error('Invalid data input.', 'Invalid!');
      return false;

    }

    let uuidNyiKo = this.getUniqueId(4);
    let nyiKoPrice = 0;

    let nyiKoNumberArr = ['01', '10', '12', '21', '23', '32', '34', '43', '45', '54', '56', '65', '67', '76', '78', '87', '89', '98', '90', '09'];

    let nyiKoNumbers = '';

    if (!this.number) {

      nyiKoNumbers = '01, 10 ,12 ,21 ,23 ,32 ,34 ,43 ,45 ,54 ,56 ,65 ,67 ,76 ,78 ,87 ,89 ,98 ,90 ,09, ';
      nyiKoPrice = nyiKoNumberArr.length * Number(this.price);

    } else {

      var arr = [...this.number];

      var matchNumbersArr = [];

      arr.forEach(e => {

        let findNumbers = nyiKoNumberArr.filter(arrBirds => arrBirds.includes(e));

        matchNumbersArr = [...matchNumbersArr, ...findNumbers];

      });

      matchNumbersArr = await matchNumbersArr.filter(function (elem, index, self) {

        if (index === self.indexOf(elem)) {
          nyiKoNumbers += elem + ", ";
        }

        return index === self.indexOf(elem);

      });

      nyiKoNumberArr = matchNumbersArr;

    }

    nyiKoPrice = nyiKoNumberArr.length * Number(this.price);

    let rowNyiKo = {
      'uuid': uuidNyiKo,
      'number': nyiKoNumbers.slice(0, -2),
      'operator': this.operator,
      'price': this.price,
      'amount': nyiKoPrice,
      'originNumber': this.number
    };

    return rowNyiKo;

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

  calculationNumber(check, arr, group, price, groupNumber) {

    for (let index = 0; index < arr.length; index++) {
      // const element = arr[index];
      let number;

      if (arr[check] != arr[index]) {

        number = arr[check] + '' + arr[index];

        groupNumber += arr[check] + '' + arr[index] + ', ';

        group.push({ 'number': number, 'price': price });

      }

    }

    return groupNumber;

  }

  async addToTableData(row, price) {

    await this.tableRow.push(row);

    this.totalAmount = await this.totalAmount + Number(price);

    this.localStorageSave();

    this.clearFunction('all');

  }

  editRow(uuid) {

    let odlEditId = this.editRowId;

    var tableEditRow = document.getElementById('row-' + odlEditId);

    if (tableEditRow) {

      tableEditRow.classList.remove('bg-red-200', 'hover:bg-red-300');
      tableEditRow.classList.add('hover:bg-indigo-100');

    }

    this.editRowId = uuid;

    var tableRow = document.getElementById('row-' + uuid);

    tableRow.classList.remove('hover:bg-indigo-100');
    tableRow.classList.add('bg-red-200', 'hover:bg-red-300');

    var editData = this.tableRow.find(obj => {
      return obj.uuid === uuid;
    });

    this.number = editData.originNumber;
    this.operator = editData.operator;
    this.price = editData.price;

    // console.log(editData);

    this.cloneSign = document.getElementById(editData.operator).cloneNode(true);

    document.getElementById('operatorbox').innerHTML = '';

    document.getElementById('operatorbox').appendChild(this.cloneSign);


  }

  appendSign(uuid, operator) {

    var sign = document.getElementById(operator).cloneNode(true);
    // console.log(uuid, operator);

    var sign = document.getElementById(operator).cloneNode(true);

    document.getElementById(uuid).innerHTML = '';

    document.getElementById(uuid).appendChild(sign);

  }

  async updateFunction() {

    // const searchValue = this.tableRow.find( ({ uuid }) => uuid === this.editRowId );
    //Find index of specific object using findIndex method.    
    let objIndex = this.tableRow.findIndex((obj => obj.uuid == this.editRowId));

    //Log object to Console.
    // console.log("Before update: ", this.tableRow[objIndex]);

    let updateData:any;

    switch (this.operator) {

      // Start atae update
      case 'atae':
        updateData = await this.ataeFunction();
      break;
      // End atae update

      // Start apyan update condition
      case 'apyan':
        updateData = await this.apyanFunction();
      break;

      // Start update ပတ်လှည့် condition
      case 'patlal':
        updateData = await this.patlalFunction();
        break;
      //End update ပတ်လှည့် condition

      // Start update Net Khat condition
      case 'netkhat':
        updateData = await this.netkhatFunction();
        break;
      //End Net update Khat condition

      // Start update Power condition
      case 'power':
        updateData = await this.powerFunction();
        break;
      // End update power condition

      // Start Apwint condition.
      case "apwint":
        updateData = await this.apwintFunction();
        break;
      // End Apwint condition.

      // Start Nyi Ko condition
      case 'nyiko':
        updateData = await this.nyikoFunction();
        break;
      // End Nyi Ko condition
      
    }

    if(updateData){

      this.totalAmount = this.totalAmount - Number(this.tableRow[objIndex]['amount']) + Number(updateData['amount']);
       this.tableRow[objIndex] = await updateData;

      this.clearFunction('all');

      this.localStorageSave();

    }

  }

  localStorageSave(){

    localStorage.setItem("tableRowData", JSON.stringify(this.tableRow));
    localStorage.setItem("totalAmount", JSON.stringify(this.totalAmount));

  }

  async deleteRow(uuid){

    let objIndex = this.tableRow.findIndex((obj => obj.uuid == uuid));

    if (objIndex > -1) {

      this.totalAmount = await this.totalAmount - Number(this.tableRow[objIndex]['amount']);
      
      this.tableRow.splice(objIndex, 1);

      this.localStorageSave();

      if(this.editRowId){
        this.clearFunction('all');
      }

    }

  }

}
