import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoaderService } from 'src/app/services/loader/loader.service';


declare var require: any;
var toastr = require('toastr');

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  constructor(private firestore: AngularFirestore, private loader:LoaderService) { }

  async saveOrder(data, time) {

    this.loader.requestStart();

    let allNumbers = '';
    if (data.roles.length) {

      let dbNumbers = this.firestore.collection("dbnumbers");

      await data.roles.forEach(async value => {
        let numberArr = await value.number.replace(/\s/g, "").split(',');

        // console.log(value.price, 'for whole numbers');
        numberArr.forEach(async number => {
          // console.log(number);

          allNumbers += number+', ';

          // Start read the amount of number and update.
          await dbNumbers.doc(number).ref.get()
            .then((doc) => {

              let totalAmount = 0;
              if (isNaN(doc.data()['amount'])) {
                totalAmount = Number(value.price);
              } else {
                totalAmount = Number(doc.data()['amount']) + Number(value.price);
              }
              // console.log(number, totalAmount);
              this.firestore
                .collection("dbnumbers")
                .doc(number)
                .set({ amount: totalAmount });

            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
            });
          // End read the amount of number and update.

        });

      });

      let collection = time.am ? data.date + 'AM' : data.date + 'PM';

      data.allNumbers = allNumbers;

      await this.firestore.collection(collection).add({
        data
      })
      .then((response)=>{
        
        this.loader.requestEnded();
        toastr.success('Successfully saved!', 'Success!');
      })
      .catch(e => {
        console.log(e);
        this.loader.requestEnded();
        toastr.error(e, 'Error!');
      });

    }

  }

  async backupFunction(){

    var data = {};
    let dbNumbers = this.firestore.collection("dbnumbers");
    var date = localStorage.getItem('dataDate');

    dbNumbers.ref.get()
    .then((snap)=>{

      snap.docs.forEach((ele)=>{
        // console.log(ele.id, ele.data());

        this.firestore
                .collection("dbnumbers-"+date)
                .doc(ele.id)
                .set({ amount: ele.data() });

        this.firestore
                .collection("dbnumbers")
                .doc(ele.id)
                .set({ amount: 0 });
        
      });
      
    })
    .catch(e => {
      console.log(e);
      this.loader.requestEnded();
      toastr.error(e, 'Error!');
    });

  }

}
