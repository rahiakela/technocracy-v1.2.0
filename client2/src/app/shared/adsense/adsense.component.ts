import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-google-adsense',
  template: `
    <div>
      <ins class="adsbygoogle"
           style="display:block;"
           data-ad-client="ca-pub-1462231592237712"
           data-ad-format="auto"></ins>
    </div>
    <br>
  `
})
export class AdsenseComponent implements AfterViewInit {

  //@Input()
  //adSlotId;

  constructor() { }

  ngAfterViewInit() {
    setTimeout(() => {
      try {
        (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
      } catch (e) {
        console.error(e);
      }
    }, 2000);
  }

}
