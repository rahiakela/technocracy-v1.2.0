import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-not-found',
  template: `
    <div class="jumbotron">
      <div class="container-fluid">
        <div class="row" style="margin-left: -30px;">
          <div class="col-md-12">
            <h4>The requested resource is not available right now.</h4>
            <p>Please have a patience, we are working on this resource.</p>
            <div>
              <button type="button" class="btn btn-block btn-primary" (click)="goBack()">Go Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    div h4 {
      font-weight: 600;
    }
    div p {
      font-size: 16px;
      font-weight: 600;
    }
    #email-icon {
      margin-top: 0rem;
      margin-left: 0rem;
    }
  `]
})
export class PageNotFoundComponent implements OnInit, AfterViewInit {

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }
}
