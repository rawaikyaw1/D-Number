import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { AngularFirestore } from '@angular/fire/firestore';


declare var require:any;
var toastr = require('toastr');


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user:any;

  constructor(public firebaseAuth : AngularFireAuth ,  public router: Router, private loader:LoaderService, private firestore: AngularFirestore) { }

  async signIn(email:string, password:string){

    this.loader.requestStart();
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
    .then(async res=>{
      // this.isLoggedIn = true;
      
      await localStorage.setItem('user', JSON.stringify(res.user));

      this.user = JSON.parse(localStorage.getItem('user'));
      console.log(this.user);
      var collection = {
        uid: this.user.uid,
        token: this.user.stsTokenManager.accessToken,
        deviceType: localStorage.getItem('deviceType'),
        deviceInfo: JSON.parse(localStorage.getItem('deviceInfo'))
      };

      var loginData = await this.firestore.collection(this.user.uid).ref.get()
      .then(async (response)=>{
        console.log(response.docs[0].id);
        
        if(response.docs.length){

          await this.firestore.collection(this.user.uid).doc(response.docs[0].id).update({
              collection
          });
          
        }else{

          await this.firestore.collection(this.user.uid).add({
            collection
          });
        }

        toastr.success('Successfully logged in!', 'Success!');
      })
      .catch(e => {
        // console.log(e);
        this.loader.requestEnded();
        toastr.error(e, 'Error!');
      });

      this.router.navigate(['dashboard']);
      this.loader.requestEnded();

    })
    .catch(e => {
      this.loader.requestEnded();
      toastr.error('Invalid user name or password.', 'Invalid!')
    });
  }

  async signUp(email:string, password:string){
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
    .then(res=>{
      // this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(res.user));

      

        this.router.navigate(['dashboard']);
      
    })
    .catch(e => {
      toastr.error(e.message, 'Error!');
    });
  }

  logout(){
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  


}
