import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SearchGamesComponent } from './search-games.component';
import { StreamsGridComponent } from './streams-grid.component';
import { StreamComponent } from './stream.component';

import { SpeedrunService } from './speedrun.service';
import { TwitchService } from './twitch.service';
import { RunnersService } from './runners.service';

import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'home',	
	template: `
	<header class="hero">
		<div class="container">
			<intro></intro>
			<search-games
				(notifySearchState)="getSearchState($event)"></search-games>
		</div>
	</header>
	
	<template [ngIf]="!onlineRunners.length && !allRunners.length && featuredRunners && featuredRunners.length > 0 && !isSearching">
		<streams-grid
			[streamsType]="'featured'"
			[runners]="featuredRunners"></streams-grid>
	</template>

	<streams-grid
		*ngIf="onlineRunners && onlineRunners.length > 0"

		[streamsType]="'live'"
		[runners]="onlineRunners"></streams-grid>
	
	<all-runners
		*ngIf="allRunners && allRunners.length > 0"
		[runners]="allRunners"></all-runners>

	<stream
		*ngIf="streamFullUrl"
		[streamUrl]="streamFullUrl"></stream>
	`,
	styleUrls: ['home.component.scss', 'runners.scss']
})
export class HomeComponent implements OnInit {
	streamFullUrl: string;
	chatFullUrl: string;
	allRunners: any[] = [];
	onlineRunners: any[] = [];
	featuredRunners: any[] = [];
	isSearching: Boolean = false;

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
			});
		
		//Search for the 'speedruns' query
		//We won't use the query 'speedrun' or 'speedrunners', because there is a game called 'Speedrunners'
		let speedrunnersStreams = this.twitchService.getSearch("speedruns", 6);

		speedrunnersStreams.subscribe((x: any) => {
        	return this.featuredRunners = this.transformStream(x);
        });
	}

	//Get search state from EventEmmitter './search-games.component.ts'
	public getSearchState(evt: any){
		this.isSearching = evt;
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
}