import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  showLoader = false;

  constructor(private loader:LoaderService) { 
    this.init();
  }

  ngOnInit(): void {
    
    this.init();

  }

  init(){

    this.loader.getLoaderObserver().subscribe((status) => {
      
      this.showLoader = status === 'start';

    });

  }

}
