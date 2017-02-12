import { Component, OnInit, Output, EventEmitter, trigger, state, style, transition, animate } from '@angular/core';
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
		(focus)="toggleGamesListState()"
		(blur)="toggleGamesListState()" />
		
		<ul
			[@listState]="gamesListState"
			(@listState.done)="gamesListState"
			*ngIf="games && gamesList"
			class="search-games__list">
			<li (click)="infoGame(game)" class="search-games__list-item" *ngFor="let game of games">
				{{ game.names.international }}
			</li>
		</ul>
	</form>
	`,
	styleUrls: ['search-games.component.scss'],
	animations: [
		trigger('listState', [
			state('inactive', style({
				transform: 'scale(.95) translateY(-8px)',
				opacity: '0',
			})),
			state('active',   style({
				transform: 'scale(1) translateY(0px)',
				opacity: '1',
			})),
			transition('inactive => active', animate('200ms ease-in')),
			transition('active => inactive', animate('200ms ease-out'))
		])
	]
})

export class SearchGamesComponent implements OnInit{
	// This is an output component that tells the rest of the world that the user has entered a valid text
	@Output() searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>(); 
	@Output() notifySearchState: EventEmitter<any> = new EventEmitter();    

	searchBoxValue: string = "";
	games: any;
	gamesList: Boolean = false;
	gamesListState: string = "inactive";
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

	private sendNotification(bool: any) {
        this.notifySearchState.emit(bool);
    }

	public toggleGamesListState(){		
		//Change it the other way around because we'll set the gamesList after this
		this.gamesListState = this.gamesList ? 'inactive' : 'active';
		//Give it a delay so that the [@gamesListState] animation can finish

		let that = this;
		setTimeout( function(){
			that.gamesList = !that.gamesList;
		}, 200);	
	}
	
	private onSearchType(value: string) {
	    this.searchUpdated.next(value); // Emit the event to all listeners that signed up - we will sign up in our contractor
	}

	//Check if name already exists in shown list
	private checkExists(userData: any, list: any){
		if (!userData.hasOwnProperty('name'))
			return false;

		let name = userData.name;

		for (let i = 0; i < list.length; i++) {
			if (list[i].name === name)
				return false;
		}

		return true;
	}

	private infoGame(game: any){
		//Time to search
		//Don't show featured runners while we're searching
	    this.sendNotification(true);

		//Reset speedrunners arrays
		//We don't want to show results of the old game
    	this.runnersService.resetRunners();

		let gameName = game.names.international;
		let gameId = game.id;

		//Set searchbox value to the game the user just clicked
		//Including capitals and all
		this.searchBoxValue = gameName;

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
							//if( !this.containObject(userData, this.runnersService.getAllRunners()) && userData.twitch != null ){
							if (this.checkExists(userData, this.runnersService.getAllRunners()) && userData.twitch != null) {
								//Add it to the array
								this.getLiveRunners(userData.twitch.uri, userData);
								//runnersService.offlineRunners.push(userData);
								this.runnersService.setAllRunners(userData);								
							}
						});						
				}
			});

		//Now it's okay
		this.sendNotification(false);
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