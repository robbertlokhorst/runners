import { Component, OnInit, Input } from '@angular/core';

import { RunnersService } from './runners.service';

@Component({
	selector: 'stream-runner',
	template: `
	<article
		class="runner-stream"
		[ngClass]="{
			'runner-stream--live': liveClass,
			'runner-stream--featured': featuredClass
		}">
		<div
			[ngClass]="{
				'runner-stream__loader--loaded': !showLoader,
				'runner-stream__loader--live': liveClass,
				'runner-stream__loader--featured': featuredClass
			}"
			class="runner-stream__loader">
			<div class="loader"></div>

			<img
				[ngClass]="{
					'runner-stream__image--loaded': !showLoader
				}"
				*ngIf="runner.stream?.preview?.medium"
				[src]="runner.stream.preview.medium | safeResourceUrl"
				(load)="toggleLoader()"
				alt=""
				class="runner-stream__image"
				(click)="changeStream(runner.name)" />
		</div>
		
		<div class="runner-stream__info">
			<h3
				class="runner-stream__name"
				(click)="changeStream(runner.name)">
				{{ runner.name }}
			</h3>
			<span class="runner-stream__viewers">
				{{ runner.stream.viewers }} watching
			</span>
			<p
				*ngIf="runner.stream.channel?.status"
				class="runner-stream__status">
				{{ runner.stream.channel.status }}
			</p>
			<p
				*ngIf="runner.stream?.game"
				class="runner-stream__playing">
				Playing: {{ runner.stream.game }}
			</p>
		</div>
	</article>
	`,
	styleUrls: ['runners.scss', 'loader.scss'],	
})

export class StreamRunnerComponent implements OnInit {
	@Input() runner: any;
	@Input() streamsType: any;

	liveClass: Boolean = false;
	featuredClass: Boolean = false;
	showLoader: Boolean = true;

	constructor(private runnersService: RunnersService) {}

	ngOnInit(): void {

		switch(this.streamsType){
			case "live":
				this.liveClass = true;
				break;

			case "featured":
				this.featuredClass = true;
				break;

			default:				
				//Default case
		}		
	}

	private toggleLoader(){
		this.showLoader = !this.showLoader;
	}

	private changeStream(username: string){
		this.runnersService.setStream(username);
	}
}