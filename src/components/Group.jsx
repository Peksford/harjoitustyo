import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import UserMenu from './UserMenu';
import { useSelector } from 'react-redux';
import 'reactjs-popup/dist/index.css';
import AlbumGroups from './AlbumGroups';
import MovieGroups from './MovieGroups';
import BookGroups from './BookGroups';
import GameGroups from './GameGroups';
import GroupGroups from './GroupGroups';

// const styles = {
//   albumContainer: {
//     display: 'flex',
//     alignItems: 'center',
//   },
//   albumInfo: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   thumbnail: {
//     width: '150px',
//     height: '150px',
//     marginRight: '1rem',
//   },
//   buttonContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//   },
//   separator: {
//     border: 'px solid #ccc',
//     margin: '10px 0',
//   },
//   sliderContainer: {
//     marginTop: '10px',
//   },
//   slider: {
//     width: '100%',
//   },
//   silderNumbers: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginTop: '5px',
//     fontSize: '14px',
//   },
//   rating: {
//     margin: 0,
//   },
//   circle: {
//     width: '60px',
//     height: '60px',
//     borderRadius: '50%',
//     border: '4px solid #646cff',
//     backgroundColor: 'transparent',
//     // color: '#fff',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '15px',
//     fontWeight: 'bold',
//   },
//   circleText: {
//     margin: 0,
//   },
// };

const Group = () => {
  const [searchWord, setSearchWord] = useState('');
  const [type, setType] = useState('albums');

  const albums = useSelector((state) => state.albums);
  const books = useSelector((state) => state.books);
  const movies = useSelector((state) => state.movies);
  const games = useSelector((state) => state.games);
  const groups = useSelector((state) => state.groups);

  const searchItem = (searchWord) => {
    let searchedItem = {};

    if (type === 'albums') {
      searchedItem = albums.filter((album) =>
        album.whole_title.toLowerCase().includes(searchWord.toLowerCase())
      );
    } else if (type === 'books') {
      searchedItem = books.filter((book) =>
        book.whole_title.toLowerCase().includes(searchWord.toLowerCase())
      );
    } else if (type === 'movies') {
      searchedItem = movies.filter((movie) =>
        movie.whole_title.toLowerCase().includes(searchWord.toLowerCase())
      );
    } else if (type === 'games') {
      searchedItem = games.filter((game) =>
        game.whole_title.toLowerCase().includes(searchWord.toLowerCase())
      );
    } else if (type === 'groups') {
      searchedItem = groups.filter((group) =>
        group.name.toLowerCase().includes(searchWord.toLowerCase())
      );
    }

    return searchedItem;
  };

  const onChange = (event) => {
    setSearchWord(event.target.value);
  };
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const displayAlbums = type === 'albums' ? searchItem(searchWord) : null;
  const displayMovies = type === 'movies' ? searchItem(searchWord) : null;
  const displayBooks = type === 'books' ? searchItem(searchWord) : null;
  const displayGames = type === 'games' ? searchItem(searchWord) : null;
  const displayGroups = type === 'groups' ? searchItem(searchWord) : null;

  const sortedAlbums =
    displayAlbums &&
    displayAlbums.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const sortedMovies =
    displayMovies &&
    displayMovies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const sortedBooks =
    displayBooks &&
    displayBooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const sortedGames =
    displayGames &&
    displayGames.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const sortedGroups =
    displayGroups &&
    displayGroups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <UserMenu />
      <h3 style={{ textAlign: 'center', marginTop: '20px' }}>
        Create a new rating club for you and your friends
      </h3>
      <div className="radio-group">
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            value="albums"
            data-testid="album"
            checked={type === 'albums'}
            onChange={handleTypeChange}
          />{' '}
          Albums
        </label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            value="movies"
            data-testid="movie"
            checked={type === 'movies'}
            onChange={handleTypeChange}
          />{' '}
          Movies
        </label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            value="books"
            data-testid="book"
            checked={type === 'books'}
            onChange={handleTypeChange}
          />{' '}
          Books
        </label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            value="games"
            data-testid="game"
            checked={type === 'games'}
            onChange={handleTypeChange}
          />{' '}
          Games{' '}
        </label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            value="groups"
            data-testid="group"
            checked={type === 'groups'}
            onChange={handleTypeChange}
          />{' '}
          Your groups{' '}
        </label>
      </div>

      <div style={{ width: '50%', marginBottom: '10px' }}>
        <input
          className="search-input"
          onChange={onChange}
          value={searchWord}
          data-testid="Search album"
          placeholder="Search"
        />
      </div>
      <AlbumGroups sortedAlbums={sortedAlbums} />
      <MovieGroups sortedMovies={sortedMovies} />
      <BookGroups sortedBooks={sortedBooks} />
      <GameGroups sortedGames={sortedGames} />
      <GroupGroups sortedGroups={sortedGroups} />
      {/* {sortedAlbums &&
        sortedAlbums.map((album) => (
          <React.Fragment key={album.id}>
            <div style={styles.albumContainer}>
              <img src={album.thumbnail} style={styles.thumbnail} />
              <div style={styles.albumInfo}>
                {album.whole_title}
                <div>
                  {!groups.some((group) => group.item_id === album.id) &&
                  !added.find(
                    (alreadyAdded) =>
                      alreadyAdded.discogs_id === album.discogs_id
                  ) ? (
                    <Popup
                      trigger={
                        <button className="button-text">
                          Create a Rating club
                        </button>
                      }
                      modal
                      nested
                      onClose={() => setFriends([])}
                      contentStyle={{
                        background: 'transparent',
                        border: 'none',
                        width: '80%',
                        height: '50%',
                      }}
                    >
                      {(close) => (
                        <div
                          className="modal-container"
                          style={{
                            backgroundImage: `url(${album.thumbnail})`,
                            backgroundSize: '30%',
                            // backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <div
                            className="modal-header"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              textAlign: 'center',
                              fontSize: '0.7rem',
                              padding: '5px 15px',
                              borderRadius: '10px',
                              width: '40%',
                            }}
                          >
                            &apos;{album.whole_title}&apos; Rating club{' '}
                          </div>

                          <div>
                            <select
                              value={friend}
                              onChange={({ target }) => setFriend(target.value)}
                            >
                              <option value="">Invite a friend</option>
                              {followed &&
                                followed.map((user) => (
                                  <option
                                    key={user.id}
                                    value={user.followed_id}
                                  >
                                    {user.followed_username}
                                  </option>
                                ))}
                            </select>
                            <div>
                              <button
                                onClick={() =>
                                  !friends.find(
                                    (already) => already === friend
                                  ) &&
                                  setFriends((prevFriends) => [
                                    ...prevFriends,
                                    friend,
                                  ])
                                }
                                style={{
                                  marginTop: '10px',
                                  marginRight: '10px',
                                }}
                              >
                                Invite
                              </button>
                              {friends.length > 0 && (
                                <button
                                  onClick={() =>
                                    createGroup(
                                      {
                                        name: album.whole_title,
                                        item_id: album.id,
                                        item_type: 'album',
                                        created_at: Date.now(),
                                        updated_at: Date.now(),
                                        friends: friends,
                                        discogs_id: album.discogs_id,
                                      },
                                      close()
                                    )
                                  }
                                >
                                  Create a club
                                </button>
                              )}
                            </div>
                          </div>
                          <div>
                            {friends.length > 0 && (
                              <div
                                style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                  textAlign: 'left',
                                  fontSize: '0.8rem',
                                  padding: '5px 15px',
                                  borderRadius: '10px',
                                  width: '100%',
                                  marginTop: '10px',
                                }}
                              >
                                Added:
                                {friends.map((friendId) => {
                                  const user = followed.find(
                                    (user) =>
                                      Number(user.followed_id) ===
                                      Number(friendId)
                                  );
                                  return user ? (
                                    <div key={user.followed_id}>
                                      {user.followed_username}
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>

                          <div className="modal-actions">
                            <button onClick={() => close()}>Close</button>
                          </div>
                        </div>
                      )}
                    </Popup>
                  ) : (
                    <div>
                      {groups.find(
                        (item) => item.discogs_id === album.discogs_id
                      ) && (
                        <Link
                          to={`/clubs/${
                            groups.find(
                              (item) => item.discogs_id === album.discogs_id
                            )?.group_member?.group_id
                          }`}
                        >
                          <button style={{ padding: '10px' }}>
                            Into Da Club
                          </button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                {album.url && (
                  <p>
                    <a
                      href={`https://www.discogs.com${album.url}`}
                      target="blank"
                      rel="noopener noreferrer"
                    >
                      <button
                        style={{
                          backgroundColor: 'black',
                          padding: '6px 14px',
                          marginTop: '10px',
                        }}
                      >
                        <img
                          src={discogsButton}
                          style={{
                            width: '100%',
                            maxWidth: '60px',
                            height: 'auto',
                          }}
                        />
                      </button>
                    </a>
                  </p>
                )}
              </div>
            </div>
            <hr />
          </React.Fragment>
        ))} */}
    </div>
  );
};

Group.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default Group;
