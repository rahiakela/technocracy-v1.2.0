import { DomSanitizer } from '@angular/platform-browser'
import {PipeTransform, Pipe} from '@angular/core';

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {

  constructor(private sanitized: DomSanitizer) {}

  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(this.decodeHTML(value));
  }

  // ref: https://gist.github.com/CatTail/4174511
  decodeHTML(text) {
    return text.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(dec);
    });
  }
}
