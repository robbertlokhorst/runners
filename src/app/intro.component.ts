import { Component } from '@angular/core';

@Component({
	selector: 'intro',
	template: `
		<p>{{ introText }}</p>
	`,

})

export class IntroComponent {
	introText: string = "Speedrunning isn’t only about the games, it’s also about the players. Running the game takes months - sometimes even years - of blood, sweat and tears. We’d like to shine a light on the runners. Give them the attention they deserve.";
}