import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit {

  public visible = false;
  public visibleAnimate = false;
  // private subscribtion: Subscription;

  constructor() {}

  ngOnInit() {
    /*this.subscribtion = this.observer.updatedData.subscribe((data: boolean) => {
      if (data) {
        this.show();
      }
    });*/
  }

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }
}
