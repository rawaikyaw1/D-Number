import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private count = 0;
  private loader$ = new BehaviorSubject<string>('');

  constructor() { }

  getLoaderObserver() : Observable<string> {
    return this.loader$.asObservable();
  }

  requestStart(){
    if(++this.count === 1){
      this.loader$.next('start');
    }
  }

  requestEnded(){
    if(this.count === 0 || --this.count === 0){
      this.loader$.next('stop');
    }
  }

  resetLoader(){
    this.count = 0;
    this.loader$.next('stop');
  }

}
