import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from "@angular/fire";
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { environment } from "src/environments/environment";
import { RegisterComponent } from './pages/register/register.component';
import { LoginService } from './services/login.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { HeaderComponent } from './common/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
      {path: 'login', component: LoginComponent},
      {path: '', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
    ]),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  providers: [LoginService],
  bootstrap: [AppComponent],
  



})
export class AppModule { }
