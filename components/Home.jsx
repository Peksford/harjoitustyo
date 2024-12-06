import SignUp from './SignUp';

const Home = ({ user, albums }) => {
  if (!albums || albums.length === 0) {
    return <h2>No albums rated yet!</h2>;
  }
  console.log('Albums here', albums);
  if (user) {
    return (
      <div>
        <h2>
          {user.username} has reviewed{' '}
          <ul>
            <li>
              {albums.length > 1 ? (
                <div>{albums.length} albums</div>
              ) : (
                <div>{albums.length} album</div>
              )}
            </li>
            <li>
              with average rating of{' '}
              {albums.reduce((a, b) => a + b.rating, 0) / albums.length}
            </li>
          </ul>
        </h2>
      </div>
    );
  }
  return (
    <div>
      <SignUp />
    </div>
  );
};

export default Home;
