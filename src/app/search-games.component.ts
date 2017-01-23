import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SpeedrunService } from './speedrun.service';
import { TwitchService } from './twitch.service';
import { RunnersService } from './runners.service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
	selector: 'search-games',
	template: `
	<form #searchForm="ngForm" class="search-games">
		<input
		autocomplete="off"
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
	`,
	styleUrls: ['search-games.component.scss'],
})

export class SearchGamesComponent implements OnInit{
	// This is an output component that tells the rest of the world that the user has entered a valid text
	@Output() searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>(); 

	searchBoxValue: string = "";
	games: any;
	showGamesList: Boolean = false;
	private searchUpdated: Subject<string> = new Subject<string>();

	constructor(private speedrunService: SpeedrunService, private runnersService: RunnersService, private twitchService: TwitchService){ }

	ngOnInit(): void {
		//Wait 300ms for more keyup events until we fire console.log()
		this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
	        .debounceTime(300)
	        .distinctUntilChanged()
	        .subscribe(q => {
	        	//Input changed
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

	//Check if two objects are the same
	private containObject(obj: any, list: any) {
	    for (let i = 0; i < list.length; i++) {
	    	//Using JSON.stringify because JavaScript is weird
	        if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
	            return true;
	        }
	    }

	    return false;
	}

	private infoGame(game: any){
		//Reset speedrunners arrays
		//We don't want to show results of the old game
    	this.runnersService.resetRunners();

		let gameName = game.names.international;
		let gameId = game.id;

		//Set searchbox value to the game the user just clicked
		//Including capitals and all
		this.searchBoxValue = gameName;
		this.showGamesList = !this.showGamesList;

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
							if( !this.containObject(userData, this.runnersService.getAllRunners()) && userData.twitch != null ){
								//Add it to the array
								this.getLiveRunners(userData.twitch.uri, userData);
								//runnersService.offlineRunners.push(userData);
								this.runnersService.setAllRunners(userData);								
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
				//Add new propery to the object called "stream"
				//This property contains the stream information of the runner
				if(stream.streams.length){
					userData["stream"] = stream.streams[0];
					//Push it to the online runners array
					this.runnersService.setOnlineRunners(userData);
				}
			});

		return streamInfo;
	}
}