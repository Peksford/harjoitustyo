## Link to application: https://im-only-rating.fly.dev/

## Description of the app
Website is designed for users who want to create their personal lists of music albums, movies/tv, books and games. Users can rate each item on a scale from 1 to 10 and follow other users to see their lists, plus compare shared items.

The homepage includes activity feed which shows what followed users have added and rated. The lists of other users (and own lists) can be filtered by date, alphabetical order, rating, or they can be searched by title.

Each item has a unique detail page displaying more information of it, for example release year, description, track list etc. Users can also select a "Pick of the Week", which is selected for the current week and displayed in the user's homepage. Pick of the Week resets every Monday.

The search field for items are using third-party APIs:
- Discogs for music
- TMDB for movies and TV shows
- Open Library and ISBNDB for books
- IDGB for games

The search field supports also advanced filtering depending on the source database.

Lastly users can create Rating Clubs, which are private groups for friends to rate the same item. It includes a comment section where friends can leave predefined comments, which are written in a little tongue-in-cheek.

## Instructions for use
### 1. Creating an account
To get started, user needs to create an account via the /signup-page. After signing up, page directs to the home page.

### 2. Searching for content
On the Home page, users can search for albums, movies, books, games or other users using the search bar. For example, selecting Albums and searching for <em>Abbey Road</em>, will display results by relevance (Discogs arranges the results). To add an item to a personal list, click 'Add'. User can give a rating for the album immeadiately by pressing 'Rate' or alternatively go into Album-page by clicking the name of the album, which is linkable after adding. This same process applies to the other content types. An Advanced Search option is also available, which utilizes the Discogs API search options. Advanced search also exists for other content types depending on the third-party API. 

### 3. Personal Lists
Users can view their personal lists by clicking the <em>menu icon</em> in the top-right corner and selecting the list. Within a list, user can filter the items using different criterias (A-Ö, highest rating, release year and mutual ratings with other user). By clicking the thumbnail of an item, it opens up the Album-page. Here users can:
* Click the heart-icon, which sets the item as the 'Pick of the Week'. Item is displayed in user's Profile page.
* Give or modify rating of the item.
* Remove the item from the Remove button at the bottom of the page.

### 4. Finding and follow other users
Other users can be searched using the main search bar. However, the exact username must be entered. Once username is selected, you'll be directed in to their Profile page, where you can click Follow and see their activity in the Home page. Followed users will appear in the Following tab on your own Profile page, and you will appear in their Followers list.

### 5. Rating Clubs
Click the group-icon in the top-right corner to create a <em>Rating Club</em>. The search bar shows only items added by the user. The user can also search for existing groups where they are a member of. To create a new club, e.g. for 'Abbey Road', search for the item and then click <em>Create a Club</em>. This opens up a pop-up window allowing you to invite followed users. After creationg, user can navigate to the club by clicking <em>Into Da Club</em>. Inside, members can rate the item and also leave predefined comments.

## Link to Work Hour Log: https://github.com/Peksford/harjoitustyo/blob/master/WorkHourLogging.md
