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
Firstly, user needs to create an account in the /signup-page. After the sign up, page directs to the home page, where user can search for albums, movies, books, games or other users. For example, selecting 'albums' and searching for Abbey Road, the results will show items in the most relevant order. Discogs itself arranges the results. Now, 'The Beatles - Abbey Road' can be added into the user's list by clicking 'Add'. User can give a rating for the album immeadiately by pressing 'Rate' or alternatively go into album-page by clicking the name of the album, which is linkable after adding. The same practice applies to the other 'art forms'. 

Own lists can be viewed by clicking the burger menu in the top right corner, and clicking, for example, 'My albums'. Here user can filter the albums by different criterias. By clicking the thumbnail of an album it directs into the Album-page. In here user can click the heart-icon, which sets the album as the 'Pick of the Week'. This puts the album into the user's profile page. User can also give or modify rating of the album. Album can also be removed from the button in the bottom of the page.

Other users can be searched from the same search bar as other items. Here the exact username of the user must be known. When username is typed, the user can be clicked, and the page directs into the user's profile page. In the profile page, users can be followed and then their activity is shown in the home-page. Username then appears into the 'following'-tab in the logged-in user's profile page, and the logged-in user is shown in 'followers' of the user. 

When clicking the group-icon in the top right corner, user can create a 'Rating Club'. Here the search bar is similar, but it shows only the items added by the user. Also there is a radio-button for the groups in which the user already is part of. Here by searching for example, 'Abbey Road', we can create a club for that item by clicking 'Create a Club'. This opens up a pop-up window where followed users can be added.
