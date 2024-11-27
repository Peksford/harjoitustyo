const Home = ({ user, albums }) => {
  if (!albums || albums.length === 0) {
    return <h2>Loading</h2>;
  }

  if (user) {
    return (
      <div>
        <h2>
          {user.username} has reviewed{' '}
          {albums.length > 1 ? (
            <div>{albums.length} albums</div>
          ) : (
            <div>{albums.length} album</div>
          )}
          with average rating of{' '}
          {albums.rating.reduce((sum, currentValue) => sum + currentValue, 0) /
            albums.length}
        </h2>
      </div>
    );
  }
  return (
    <div>
      <h2>Welcome to MusicBox!</h2>
    </div>
  );
};

export default Home;
