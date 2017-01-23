import { Component, Input } from '@angular/core';

@Component({
	selector: 'all-runners',
	template: `
	<div class="runners">
		<div class="container">
			<h2 class="small-title runners__title">All runners</h2>

			<ul class="runners__list">
				<li class="runners__list-item" *ngFor="let runner of runners">
					{{ runner.name }}
				</li>
			</ul>
		</div>
	</div>
	`,
	styleUrls: ['runners.scss'],
})

export class AllRunnersComponent {
	@Input() runners: any;
}