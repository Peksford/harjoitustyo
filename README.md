## Link to application: https://im-only-rating.fly.dev/

## Description of the app
Website is intent for users to create an account and build personal lists of music albums, movies/tv, books and games. Users can rate each item on a scale from 1 to 10. They can follow other users to see what they have added and compare mutual items.

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

### 4. 

Other users can be searched from the same search bar as other items. Here the exact username of the user must be known. When username is typed, the user can be clicked, and the page directs into the user's profile page. In the profile page, users can be followed and then their activity is shown in the home-page. Username then appears into the 'following'-tab in the logged-in user's profile page, and the logged-in user is shown in 'followers' of the user. 

When clicking the group-icon in the top right corner, user can create a 'Rating Club'. Here the search bar is similar, but it shows only the items added by the user. The user can also search for groups where they are already a member. Here by searching for example, 'Abbey Road', we can create a club for that item by clicking 'Create a Club'. This opens up a pop-up window where followed users can be added to the club. When club is created, user can navigate there by clicking 'Into Da Club'. Here members can give a rating for the item and also leave a pre-defined comments.
