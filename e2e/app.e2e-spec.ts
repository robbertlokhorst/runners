import { TwitchSpeedrunPage } from './app.po';

describe('twitch-speedrun App', function() {
  let page: TwitchSpeedrunPage;

  beforeEach(() => {
    page = new TwitchSpeedrunPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
