import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SpeedrunService } from './speedrun.service';
import { TwitchService } from './twitch.service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
	selector: 'home',	
	template: `
	<div class="bg__blend"></div>
	
	<div class="bg__wrap">
	
		<form #searchForm="ngForm" class="search-games">
			<input
			class="search-games__input"
			type="search"
			placeholder="Search for games..."
			[(ngModel)]="searchBoxValue" [value]="searchBoxValue"
			#searchBox="ngModel" name="searchBox"
			(keyup)="onSearchType($event.target.value)"
			(focus)="showGamesList = !showGamesList" />
			
			<ul *ngIf="games && showGamesList" class="search-games__list">
				<li (click)="infoGame(game)" class="search-games__list-item" *ngFor="let game of games">
					{{ game.names.international }}
				</li>
			</ul>
		</form>

		<ul *ngIf="speedrunners && speedrunners.length > 0" class="list">
			<li class="list__item" *ngFor="let runner of speedrunners">
				{{ runner.name }}
			</li>
		</ul>

		<ul *ngIf="liveSpeedrunners && liveSpeedrunners.length > 0" class="list">
			<li (click)="setStream(runner.name)" class="list__item" *ngFor="let runner of liveSpeedrunners">
				{{ runner.name }}
			</li>
		</ul>

		<iframe 
			*ngIf="streamFullUrl"
			[src]="streamFullUrl | safeUrl"
	        height="720" 
	        width="1280" 
	        frameborder="0" 
	        scrolling="no"
	        allowfullscreen="true">
	    </iframe>
	    <iframe
	    	*ngIf="chatFullUrl"
	    	frameborder="0" 
	        scrolling="no" 
	        id="chat_embed" 
	        [src]="chatFullUrl | safeUrl" 
	        height="500" 
	        width="1280">
		</iframe>
	</div>
	`,
	styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
	@Output() searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();  // This is an output component that tells the rest of the world that the user has entered a valid text

	searchBoxValue: string = "";
	showGamesList: Boolean = false;
	games: any;
	speedrunners: any = [];
	liveSpeedrunners: any = [];
	streamFullUrl: string;
	chatFullUrl: string;
	private searchUpdated: Subject<string> = new Subject<string>();

	constructor(private speedrunService: SpeedrunService, private twitchService: TwitchService) { }

	ngOnInit(): void {
		//Wait 300ms for more keyup events until we fire console.log()
		this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
	        .debounceTime(300)
	        .distinctUntilChanged()
	        .subscribe(q => {
	        	//Input changed
	        	//Reset speedrunners array
	        	this.speedrunners = [];
	        	this.liveSpeedrunners = [];        	

	        	//Get the games list
	        	this.speedrunService.getGames(q)
	        		.subscribe( (games: any) => {
	        			this.games = games.data;
	        		});
	        });
	}

	private onSearchType(value: string) {
	    this.searchUpdated.next(value); // Emit the event to all listeners that signed up - we will sign up in our contractor
	}	

	private infoGame(game: any){
		let gameName = game.names.international;
		let gameId = game.id;

		this.searchBoxValue = gameName;
		this.showGamesList = !this.showGamesList;
		
		//Check if two objects are the same
		function containObject(obj: any, list: any) {
		    for (let i = 0; i < list.length; i++) {
		    	//Using JSON.stringify because JavaScript is weird
		        if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
		            return true;
		        }
		    }

		    return false;
		}

		this.speedrunService.getRuns(gameId, 100)
			.subscribe( (runs: any) => {
				let users = runs.data.map( (run: any ) => run.players[0].id );				

				for(let i = 0; i < users.length; i++){
					this.speedrunService.getUser(users[i])
						.subscribe( (user: any) => {
							//Get compact userdata							
							let userData = {
								name: user.data.names.international,
								twitch: user.data.twitch,								
							}

							//If userData isn't in the array
							if( !containObject(userData, this.speedrunners) && userData.twitch != null ){
								//Add it to the array
								this.getLiveRunners(userData.twitch.uri, userData);
								this.speedrunners.push(userData);
							}
						});						
				}
			});
	}

	private getLiveRunners(twitchUrl: string, userData: any){
		//Get last part of Twitch URL
		//Ex. https://www.twitch.tv/druvan7
		let username = twitchUrl.split('/').pop();
		let streamInfo: any;

		this.twitchService.getUser(username)
			.subscribe( (stream: any) => {
				//Do something with the stream
				if(stream.streams.length){
					userData["stream"] = stream.streams[0];
					this.liveSpeedrunners.push(userData);
				}
			});

		return streamInfo;
	}

	private setStream(username: string){
		//set the Twitch stream iframe
		this.streamFullUrl = "http://player.twitch.tv/?channel=" + username;
		this.chatFullUrl = "http://www.twitch.tv/" + username + "/chat";
	}

}