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
		<img
			*ngIf="runner.stream?.preview?.medium"
			[src]="runner.stream.preview.medium | safeResourceUrl"
			alt=""
			class="runner-stream__image"
			(click)="changeStream(runner.name)" />
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
	styleUrls: ['runners.scss'],	
})

export class StreamRunnerComponent implements OnInit {
	@Input() runner: any;
	@Input() streamsType: any;
	liveClass: Boolean = false;
	featuredClass: Boolean = false;

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

	private changeStream(username: string){
		this.runnersService.setStream(username);
	}
}