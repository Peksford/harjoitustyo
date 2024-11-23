const Home = ({ albums }) => {
  if (!albums || albums.length === 0) {
    return <h2>No albums</h2>;
  }
  return (
    <div>
      <h1>
        Peksin lempialbumit
        <ul>
          {albums.map((album) => (
            <li key={album.id}>{album.title}</li>
          ))}
        </ul>
      </h1>
    </div>
  );
};

export default Home;
