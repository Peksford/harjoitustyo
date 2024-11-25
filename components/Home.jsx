const Home = ({ albums, user }) => {
  if (!albums || albums.length === 0) {
    return <h2>No albums</h2>;
  }
  if (!user) {
    return <h2>Your musicbox, sign in!</h2>;
  }
  return (
    <div>
      <h2>
        {user.username} MusicBox:
        <ul>
          {albums.map((album) => (
            <li key={album.id}>{album.title}</li>
          ))}
        </ul>
      </h2>
    </div>
  );
};

export default Home;
