import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class TwitchService {
    private _client_id = "2py5hkexxgq86inbbpfsiv8i7rq0oef";
    private _base_url = "https://api.twitch.tv/kraken";
    
    constructor(private http: Http){
    }
    
    getUser(user: string) {
        return this.http.get(this._base_url + '/streams/?channel=' + user + '&client_id=' + this._client_id)
            .map(res => res.json());
    }

    getSearch(query: string, limit: any = 25){
        return this.http.get(this._base_url + '/search/streams/?q=' + query + '&limit=' + limit + '&client_id=' + this._client_id)
            .map(res => res.json());
    }

    getStream() {
        
    }
}