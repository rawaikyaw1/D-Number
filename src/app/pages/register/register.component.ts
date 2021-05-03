import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

declare var require:any;
var toastr = require('toastr');

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  
  constructor(public loginService: LoginService) { }

  registerForm;
  
  ngOnInit(): void {
    if(localStorage.getItem('user') !== null){
      console.log('user is logged in', localStorage.getItem('user'));
    }
    
    
  }
  
  async onClickSubmit(form){
    var submit = true;
    if(form.email == ""){
      toastr.error('Provide valid input data.', 'Invalid!');
      submit = false;
    }

    if(form.password == "" || form.confirm_password == "" || form.password !== form.confirm_password){
      toastr.error('Password confirmation failed.', 'Invalid!')
      submit = false;
    }

    // console.log(submit, form);

    if(submit){
       await this.loginService.signUp(form.email, form.password);
    }
    
   
  }
  
}
