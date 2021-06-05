import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';


declare var require:any;
var toastr = require('toastr');

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public firebaseAuth : AngularFireAuth ,  public router: Router, private loader:LoaderService) { }

  async signIn(email:string, password:string){

    this.loader.requestStart();
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
    .then(res=>{
      // this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(res.user));

      this.router.navigate(['dashboard']);
      this.loader.requestEnded();

    })
    .catch(e => {
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
