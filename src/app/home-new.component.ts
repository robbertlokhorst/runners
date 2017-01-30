import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SearchGamesComponent } from './search-games.component';
import { StreamsGridComponent } from './streams-grid.component';
import { StreamComponent } from './stream.component';

import { SpeedrunService } from './speedrun.service';
import { TwitchService } from './twitch.service';
import { RunnersService } from './runners.service';

import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'home-new',	
	template: `
	<header class="hero">
		<div class="container">
			<intro></intro>
			<search-games></search-games>
		</div>
	</header>
	
	<template [ngIf]="!onlineRunners.length && !allRunners.length && featuredRunners && featuredRunners.length > 0">
		<streams-grid
			[streamsType]="'featured'"
			[runners]="featuredRunners"></streams-grid>
	</template>

	<template [ngIf]="onlineRunners && onlineRunners.length > 0">
		<streams-grid
			[streamsType]="'live'"
			[runners]="onlineRunners"></streams-grid>
	</template>
	
	<template [ngIf]="allRunners && allRunners.length > 0">
		<all-runners
			[runners]="allRunners"></all-runners>
	</template>

	<stream
		#scrollMe
		*ngIf="streamFullUrl"
		[streamUrl]="streamFullUrl"></stream>
	`,
	styleUrls: ['home.component.scss', 'runners.scss']
})
export class HomeNewComponent implements OnInit {
	@ViewChild('scrollMe') private myScrollContainer: ElementRef;

	streamFullUrl: string;
	chatFullUrl: string;
	allRunners: any[] = [];
	onlineRunners: any[] = [];
	featuredRunners: any[] = [];

	constructor(
		private speedrunService: SpeedrunService,
		private twitchService: TwitchService,
		private runnersService: RunnersService) { }

	ngOnInit(): void{
		this.runnersService.allRunnersUpdated
			.subscribe( (x: any) => this.allRunners = x );

		this.runnersService.onlineRunnersUpdated
			.subscribe( (x: any) => this.onlineRunners = x );

		this.runnersService.streamUpdated
			.subscribe( (url: string) => {
				this.streamFullUrl = url;
				this.scrollToBottom();
			});
		
		//Search for the two queries
		//We won't use the query 'speedrun' or 'speedrunners', because there is a game called 'Speedrunners'
		let speedrunningStreams = this.twitchService.getSearch("speedrunning", 6);
		let speedrunnersStreams = this.twitchService.getSearch("speedruns", 6);
		
		//Merge the two data streams together and subscribe to them
		//Not yet working exactly like it should
		speedrunningStreams.merge(speedrunnersStreams)
            .subscribe((x: any) => {
            	console.log("x", x);
            	return this.featuredRunners = this.transformStream(x);
            });
	}

	private transformStream(obj: any){
		let streams = obj.streams;
		let transformedStreams: any[] = [];

		for (let prop in streams) {
			let userData = {
				name: streams[prop]["channel"]["display_name"],
				stream: streams[prop]			
			};

			transformedStreams.push(userData);
		}

		return transformedStreams;
	}

	scrollToBottom(): void {
        try {
        	console.log(this.myScrollContainer.nativeElement.scrollTop);
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            console.log(this.myScrollContainer.nativeElement.scrollTop);
        } catch(err) {
        	console.log("ERROR", err);
        }                 
    }
}