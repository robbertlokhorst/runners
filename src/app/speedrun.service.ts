import { Injectable } from '@angular/core';
import { Jsonp } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class SpeedrunService {
	private _client_id = "l9e44g5l3rcs24mzpyfyvyq4x";
    private _speedrun_url = "https://www.speedrun.com/api/v1";

    constructor(private _jsonp: Jsonp){ }
    
    getByType(type: string, query: any) {
        return this._jsonp
            .get(this._speedrun_url + '/' + type + '?name=' + query + '&callback=JSONP_CALLBACK')
            .map(res => res.json());
    }

    getGames(query: any) {
        return this.getByType("games", query);
    }

    getRuns(id: string, limit: Number = 10) {
        return this._jsonp
            //Get most recent verified runs
            .get(this._speedrun_url + '/runs?game=' + id + '&max=' + limit + '&status=verified&orderby=verify-date&direction=desc&callback=JSONP_CALLBACK')
            .map(res => res.json());
    }

    getUser(id: string){
        return this._jsonp
            .get(this._speedrun_url + '/users/' + id + '?callback=JSONP_CALLBACK')
            .map(res => res.json());
    }
}