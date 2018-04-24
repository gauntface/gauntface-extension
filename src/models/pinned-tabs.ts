import {logger} from '../utils/logger';

function getDocRef(userId: string): string {
  return `UrlsToPin/${userId}`;
}

export async function getUrlsToPin(userId: string): Promise<string[]> {
  // UrlsToPin
  //   - <User ID>
  //     (urls: string[])
  logger.log(`TODO: getDocRef: `, getDocRef(userId));
  
  return [
    'https://inbox.google.com/',
    'https://tweetdeck.twitter.com/',
    'https://open.spotify.com/'
  ];
}