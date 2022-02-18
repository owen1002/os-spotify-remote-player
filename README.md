# Demo of spotify connect api using next-auth

### Getting started: Before trying os-spotify-remote-player, please open up your own spotify app first. (Restriction from Spotify, we need a active device)

## Technical Stuffs
 - Using useDebounce useEffect to control volume (Prevent spamming api calls. Sliding the range input will keep triggering)
 - Next-auth with oauth jwt
 - Nextjs middleware to control authenticated route
 - Use Recoil for simple state management