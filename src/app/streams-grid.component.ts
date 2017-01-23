import { Component, Input, OnInit } from '@angular/core';

import { StreamRunnerComponent } from './stream-runner.component';

@Component({
	selector: 'streams-grid',
	template: `
	<div
		class="runners"
		[ngClass]="{
			'runners--live': liveClass,
			'runners--featured': featuredClass
		}">
		<div class="container">
			<h2 class="small-title runners__title">
				{{ title }}
			</h2>

			<ul class="row runners--live__list">
				<li												
					class="col-xs-6	col-sm-4"
					*ngFor="let runner of runners">

					<stream-runner
						*ngIf="runner.stream"
						[streamsType]="streamsType"
						[runner]="runner"></stream-runner>					
				</li>
			</ul>
		</div>
	</div>
	`,
	styleUrls: ['runners.scss'],
})

export class StreamsGridComponent implements OnInit {
	@Input() runners: any;
	@Input() streamsType: any;

	title: string;
	liveClass: Boolean = false;
	featuredClass: Boolean = false;

	ngOnInit(): void {
		switch(this.streamsType){
			case "live":
				this.title = "Live";
				this.liveClass = true;
				break;

			case "featured":
				this.title = "Featured runners";
				this.featuredClass = true;
				break;

			default:				
				this.title = "Runners";
		}		
	}
}