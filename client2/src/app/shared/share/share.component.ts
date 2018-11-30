import {Component, Input, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  // ref: https://github.com/MurhafSousli/ngx-sharebuttons/wiki/Share-Buttons-Component
  facebookButton;
  googleButton;
  linkedinButton;
  twitterButton;
  envelopeButton;
  whatsappButton;

  @Input()
  url: string;
  @Input()
  title: string;

  description: string;

  constructor(private titleService: Title,
              private meta: Meta) { }

  ngOnInit() {
    // ShareButton(button name [provider], template, classes)
    /*this.facebookButton = new ShareButton(ShareProvider.FACEBOOK, '<i class="fa fa-facebook"></i>', 'facebook');
    this.googleButton = new  ShareButton(ShareProvider.GOOGLEPLUS, '<i class="fa fa-google-plus"></i>', 'google-plus');
    this.linkedinButton = new ShareButton(ShareProvider.LINKEDIN, '<i class="fa fa-linkedin"></i>', 'linkedin');
    this.twitterButton = new ShareButton(ShareProvider.TWITTER, '<i class="fa fa-twitter"></i>', 'twitter');
    this.whatsappButton = new ShareButton(ShareProvider.WHATSAPP, '<i class="fa fa-whatsapp"></i>', 'whatsapp');
*/
    // setting page title and meta tag description
    this.titleService.setTitle(this.title);
    this.meta.addTag({name: 'description', content: this.description});
  }

}
