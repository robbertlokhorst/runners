import { Injectable, EventEmitter } from '@angular/core';

import 'rxjs/add/operator/map';

@Injectable()
export class RunnersService {
    allRunnersUpdated:EventEmitter<any> = new EventEmitter();
    onlineRunnersUpdated:EventEmitter<any> = new EventEmitter();
    private allRunners: any = [];
    private onlineRunners: any = [];

    resetRunners(){
        this.allRunners = [];
        this.onlineRunners = [];
        this.allRunnersUpdated.emit(this.allRunners);
        this.onlineRunnersUpdated.emit(this.onlineRunners);
    }

    getAllRunners(){
        return this.allRunners;
    }

    getOnlineRunners(){
        return this.onlineRunners;
    }

    setAllRunners(data: any){
        this.allRunners.push(data);
        this.allRunnersUpdated.emit(this.allRunners);
    }

    setOnlineRunners(data:any){
        this.onlineRunners.push(data);
        this.onlineRunnersUpdated.emit(this.onlineRunners);
    }
}