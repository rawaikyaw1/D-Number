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
import { HistoryComponent } from './pages/history/history.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingComponent } from './common/loading/loading.component';
import { RecordsComponent } from './pages/records/records.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TableComponent } from './pages/table/table.component';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    HeaderComponent,
    HistoryComponent,
    HomeComponent,
    LoadingComponent,
    RecordsComponent,
    TableComponent
    
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      // {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
      {path: 'dashboard', component: HomeComponent, canActivate:[AuthGuard]},
      {path: 'login', component: LoginComponent},
      {path: '', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      // {path: 'history', component: HistoryComponent},
      {path: 'records', component: RecordsComponent, canActivate:[AuthGuard]},
      {path: 'table', component: TableComponent, canActivate:[AuthGuard]},
    ]),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    QRCodeModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent],
  



})
export class AppModule { }
