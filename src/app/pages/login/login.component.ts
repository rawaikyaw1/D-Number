import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public loginService: LoginService, public router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('user')){
      // console.log(localStorage.getItem('user'));
      this.router.navigate(['dashboard']);

    }
  }

  onClickSubmit(form){
    if(form.email !== "" && form.password !== ""){
      this.loginService.signIn(form.email, form.password);
    }
  }

}
