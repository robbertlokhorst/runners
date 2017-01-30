import { Component, OnInit } from '@angular/core';

import { MailtoPipe } from './mailto.pipe';

@Component({
	selector: 'runners-footer',
	template: `
	<footer class="footer">
		<div class="container">
			<span class="footer__mail"><a [href]="mail | mailto">{{ mail }}</a></span>
		</div>
	</footer>
	`,
	styleUrls: ['footer.component.scss']
})

export class FooterComponent implements OnInit{
	mail: any;

	ngOnInit(): void {
		this.mail = "info@robbertlokhorst.nl";
	}
}