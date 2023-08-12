* Instead of fetching profile in authcheck middleware, fetch profile in getprofile route and use not logged in if user is not present because :-
  * user data will not be fetched in every request
  * getprofile always runs whenever page is loaded or reloaded so user will always be authenticated

* Add 512x512 icon to manifest.json

* round percentage in attendance percentage and add percentage sign