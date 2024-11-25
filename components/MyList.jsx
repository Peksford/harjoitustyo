const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  },
  card: {
    border: '1px ',
    padding: '10px',
    textAlign: 'center',
    borderRadius: '5px',
  },
  thumbnail: {
    width: '150px',
    height: '150px',
    marginRight: '1rem',
  },
};

const MyList = ({ albums }) => {
  if (!albums || albums.length === 0) {
    return <h2>No albums added yet</h2>;
  }
  console.log('mylist', albums);
  return (
    <div style={styles.container}>
      {albums.map((album) => (
        <div key={album.id} style={styles.card}>
          <img src={album.thumbnail} style={styles.thumbnail} />
        </div>
      ))}
    </div>
  );
};

export default MyList;
