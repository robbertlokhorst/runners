import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';

import { WindowRefService } from './window-ref.service';

@Component({
	selector: 'stream',
	template: `
	<div class="stream" #scrollMe>
		<div class="stream__container">
			<iframe
				class="stream__iframe"
				[src]="streamUrl | safeResourceUrl"
				(load)="smoothScroll()"
		        height="720" 
		        width="1280" 
		        frameborder="0" 
		        scrolling="no"
		        allowfullscreen="true">
		    </iframe>
		</div>
	</div>
	`,
	styleUrls: ['stream.component.scss']
})

export class StreamComponent implements OnInit {
	@ViewChild('scrollMe') private myScrollContainer: ElementRef;
	@Input() streamUrl: any;
	private _window: Window;

	constructor(private windowRef: WindowRefService){}

	ngOnInit(): void{
		this._window = this.windowRef.nativeWindow;
	}	

    smoothScroll(eID: any) {
        var startY = this.currentYPosition();
        var stopY = this.elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            this._window.scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 100);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for (var i = startY; i < stopY; i += step) {
                this.scrollTo(leapY, timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for (var i = startY; i > stopY; i -= step) {
            this.scrollTo(leapY, timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
    }

    private scrollTo(yPoint: number, duration: number) {
        setTimeout(() => {
            this._window.scrollTo(0, yPoint)
        }, duration);
        return;
    }

    private elmYPosition(eID: any){
    	let el = this.myScrollContainer.nativeElement;
    	let y = el.offsetTop;
    	let node = el;

    	while (node.offsetParent && node.offsetParent != document.body) {
	        node = node.offsetParent;
	        y += node.offsetTop;
	    } return y;
    }

    private currentYPosition(){
    	// Firefox, Chrome, Opera, Safari
	    if (self.pageYOffset) return self.pageYOffset;
	    // Internet Explorer 6 - standards mode
	    if (document.documentElement && document.documentElement.scrollTop)
	        return document.documentElement.scrollTop;
	    // Internet Explorer 6, 7 and 8
	    if (document.body.scrollTop) return document.body.scrollTop;
	    return 0;
    }
}