import { Component, Input, trigger, state, style, transition, animate } from '@angular/core';

@Component({
	selector: 'all-runners',
	template: `
	<div class="runners">
		<div class="container">
			<h2 class="small-title runners__title">All runners <span>Opens Twitch profile in new tab</span></h2>

			<ul class="runners__list">
				<li [@showUp]="'shown'" class="runners__list-item" *ngFor="let runner of runners">
					<a [href]="runner.twitch.uri | safeUrl" target="_blank">{{ runner.name }}</a>
				</li>
			</ul>
		</div>
	</div>
	`,
	styleUrls: ['runners.scss'],
	animations: [
		trigger('showUp', [
			state('shown',
				style({
					transform: 'translateY(0)',
					opacity: '1',
				})
			),
			transition('void => *', [
				style({
					transform: 'translateY(-10%)',
					opacity: '0',
				}),
				animate(100)
			]),
			transition('* => void', [
				animate(100, style({
					transform: 'translateY(10%)',
					opacity: '0'
				}))
			])
		])]
})

export class AllRunnersComponent {
	@Input() runners: any;
}