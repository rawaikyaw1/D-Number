import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
declare var require:any;
var toastr = require('toastr');

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private firestore: AngularFirestore) { }


  async postOrder(data) {

    let totalAmount = 0;
    await this.firestore
    .collection("dbnumbers")
    .doc(data.numbers).ref.get().then(function (doc) {
      if (doc.exists) {

        if(isNaN(doc.data()['amount'])){

          totalAmount = parseInt(data.price);

        }else{

          totalAmount = parseInt(doc.data()['amount'])+parseInt(data.price);

        }

        console.log(totalAmount, doc.data()['amount']);

      } else {
        console.log("There is no document!");
      }
    }).catch(function (error) {
      console.log("There was an error getting your document:", error);
    });

    // console.log(data);

    if(data.am){
      
      await this.firestore.collection(data.date+'AM').add({
        data
      })
      .catch(e => {
        console.log(e);
      });

    }

    if(data.pm){
      
      await this.firestore.collection(data.date+'PM').add({
        data
      })
      .catch(e => {
        console.log(e);
      });

    }

    toastr.success('Successfully added.', 'Success!')


    return this.firestore
      .collection("dbnumbers")
      .doc(data.numbers)
      .set({ amount: totalAmount });

  }

  async apyanPostOrder(data) {
    
    let firstNumber = data.numbers;

    let dbnumbers = this.firestore.collection("dbnumbers");

    let totalAmount = 0;

    //calculate first number

    dbnumbers.doc(firstNumber).ref.get()
    .then((doc) => {
      if(isNaN(doc.data()['amount'])){
        totalAmount = parseInt(data.price);
      }else{
        totalAmount = parseInt(doc.data()['amount'])+parseInt(data.price);
      }
      // console.log(firstNumber, totalAmount);
      this.firestore
      .collection("dbnumbers")
      .doc(firstNumber)
      .set({ amount: totalAmount });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    //calculate second number
    totalAmount = 0;
    let numberArr = [...data.numbers];

    let secondNumber = numberArr[1]+numberArr[0];

    dbnumbers.doc(secondNumber).ref.get()
    .then((doc) => {
      if(isNaN(doc.data()['amount'])){
        totalAmount = parseInt(data.price);
      }else{
        totalAmount = parseInt(doc.data()['amount'])+parseInt(data.price);
      }
      this.firestore
      .collection("dbnumbers")
      .doc(secondNumber)
      .set({ amount: totalAmount });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    
    toastr.success('Successfully added.', 'Success!')
    return true;

  }

}
