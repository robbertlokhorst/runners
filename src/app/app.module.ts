import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeNewComponent } from './home-new.component';
import { SearchGamesComponent } from './search-games.component';
import { IntroComponent } from './intro.component';
import { StreamsGridComponent } from './streams-grid.component';
import { StreamRunnerComponent } from './stream-runner.component';
import { AllRunnersComponent } from './all-runners.component';

import { SpeedrunService } from './speedrun.service';
import { TwitchService } from './twitch.service';
import { RunnersService } from './runners.service';

import { SafeUrlPipe } from './safe-url.pipe';
import { SafeStylePipe } from './safe-style.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeNewComponent,
    SearchGamesComponent,
    IntroComponent,
    StreamsGridComponent,
    StreamRunnerComponent,
    AllRunnersComponent,
    SafeUrlPipe,
    SafeStylePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeNewComponent,
      }
    ])
  ],
  providers: [
    SpeedrunService,
    TwitchService,
    RunnersService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
