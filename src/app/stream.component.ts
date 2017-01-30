import { Component, Input } from '@angular/core';

@Component({
	selector: 'stream',
	template: `
	<div class="stream">
		<div class="stream__container">
			<iframe
				class="stream__iframe"
				[src]="streamUrl | safeResourceUrl"
		        height="720" 
		        width="1280" 
		        frameborder="0" 
		        scrolling="no"
		        allowfullscreen="true">
		    </iframe>
		</div>
	</div>
	`,
	styleUrls: ['stream.component.scss']
})

export class StreamComponent {
	@Input() streamUrl: any;
}