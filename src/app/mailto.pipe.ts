import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'mailto' })
export class MailtoPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(mailto: string) {
    return this.sanitizer.bypassSecurityTrustUrl("mailto:" + mailto);
  }
}