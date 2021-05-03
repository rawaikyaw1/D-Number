import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  showMenu = false;
  rightMenu = false;
  mobileMenu = false;

  constructor(public loginService: LoginService) { }

  ngOnInit(): void {
  }

  signOut(){
    this.loginService.logout();

  }

  toggleRightMenu(){
    if(this.rightMenu){
      this.rightMenu = false;
    }else{
      this.rightMenu = true;
    }
  }

  tootleMoboleMenu(){
    if(this.mobileMenu){
      this.mobileMenu = false;
    }else{
      this.mobileMenu = true;
    }
  }

}
