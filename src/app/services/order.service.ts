import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { LoginService } from './login.service';


declare var require: any;
var toastr = require('toastr');



@Injectable({
  providedIn: 'root'
})

export class OrderService {

  constructor(private firestore: AngularFirestore, private loader:LoaderService, private loginService:LoginService, private router: Router) { }

  user = JSON.parse(localStorage.getItem('user'));


  async saveOrder(data, time) {

    var ifConnected = window.navigator.onLine;

    if(!ifConnected){

      this.loader.requestEnded();
        toastr.error('Please connect to internet!', 'Connnection lose!');
        return false;


    }

    this.loader.requestStart();

    // console.log(data.roles.length, data, data.roles);
    if (data.roles.length) {

      await this.checkTokenMatch(data, time);

    }else{

      this.loader.requestEnded();
        toastr.error('Data not saved!', 'Error!');

    }

  }


  async combineData(data, time){
    var allNumbers = '';
    var dataObjs = [];

    
    
     await data.roles.forEach(async value => {
      let numberArr = await value.number.replace(/\s/g, "").split(',');

      numberArr.forEach(async number => {
        
        dataObjs.push({"id":number, "price":Number(value.price)});

        allNumbers += number+', ';


      });

    });

    let collection = time.am ? data.date + 'AM' : data.date + 'PM';

      data.allNumbers = allNumbers;

      // console.log(collection);

      await this.firestore.collection(this.user.email+collection).add({
        data
      })
      .then((response)=>{
        
        this.loader.requestEnded();
        toastr.success('Successfully saved!', 'Success!');
      })
      .catch(e => {
        // console.log(e);
        this.loader.requestEnded();
        toastr.error(e, 'Error!');
      });

    // let sumData = dataObjs.reduce((a, b) => a.set(b.id, (a.get(b.id) || 0) + Number(b.price)), new Map);

    // return sumData;
    

  }


  async getRecords(date = null){

    this.loader.requestStart();
    var objects = [];
    
    await this.firestore.collection(this.user.email+date).ref.get()
    .then((snap)=>{
      snap.forEach(element => {
        // console.log(typeof element.data()['data']);
        objects.push(element.data()['data']);

      });

    })
    .catch(e => {
      // console.log(e);
      this.loader.requestEnded();
      toastr.error(e, 'Error!');
    });

    this.loader.requestEnded();
    // console.log(objects);
    return objects;

  }

  async checkTokenMatch(data, time) {

    let user = JSON.parse(localStorage.getItem('user'));
    
    await this.firestore.collection(user.uid).ref.get()
    .then((res)=>{

      if(res.docs.length){

        res.forEach(element => {
          // console.log(element.data()['collection']['token']);
  
          if(user['stsTokenManager'].accessToken != element.data()['collection']['token']){
            this.loginService.logout();
  
            toastr.error('Session expired!', 'Invalid!');
            this.loader.requestEnded();
            this.router.navigate(['login']);

            
          }else{
  
            // console.log('match');
            this.combineData(data, time);
            this.loader.requestEnded();
  
          }
  
        });

      }else{

        toastr.error('Session expired! Please login again.', 'Expired!');
        this.loader.requestEnded();

      }

      

    })
    .catch(e => {
      // console.log(e);
      this.loader.requestEnded();
      toastr.error(e, 'Error!');
    });

  }

}
