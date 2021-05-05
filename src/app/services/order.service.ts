import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private firestore: AngularFirestore) { }


  async postOrder(data) {

    let totalAmount = 0;
    // await this.firestore
    // .collection("dbnumbers")
    // .doc(data.numbers).ref.get().then(function (doc) {
    //   if (doc.exists) {


    //     if(isNaN(doc.data()['amount'])){

    //       totalAmount = parseInt(data.price);

    //     }else{

    //       totalAmount = parseInt(doc.data()['amount'])+parseInt(data.price);

    //     }


    //     console.log(totalAmount, doc.data()['amount']);




    //   } else {
    //     console.log("There is no document!");
    //   }
    // }).catch(function (error) {
    //   console.log("There was an error getting your document:", error);
    // });

    console.log(data.date);
    // let name = data.name;

    await this.firestore.collection(data.date).add({
      data
    })
    .catch(e => {
      console.log(e);
    });


    return this.firestore
      .collection("dbnumbers")
      .doc(data.numbers)
      .set({ amount: totalAmount });

  }

}
