import { Component, ViewEncapsulation } from '@angular/core';

import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component'; 

@Component({
	selector: 'app-root',
	template: `
		<runners-header></runners-header>
		<router-outlet></router-outlet>
		<runners-footer></runners-footer>
	`,
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./app.component.scss'],
})

export class AppComponent {
}
