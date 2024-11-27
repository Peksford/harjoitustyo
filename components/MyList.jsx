import { Link } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  },
  card: {
    border: '1px',
    padding: '10px',
    textAlign: 'center',
    borderRadius: '5px',
    position: 'relative',
  },
  thumbnail: {
    width: '150px',
    height: '150px',
    marginRight: '1rem',
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    top: '110%',
    left: '46%',
    transform: 'translate(-50%, -50%)',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '2px solid #646cff',
    backgroundColor: 'transparent',
    // color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  circleText: {
    margin: 0,
  },
};

const MyList = ({ albums, user }) => {
  if (!albums || albums.length === 0) {
    return <h2>No albums added yet</h2>;
  }
  console.log('mylist', albums);
  return (
    <div style={styles.container}>
      {albums.map((album) => (
        <div key={album.id} style={styles.card}>
          <Link to={`${user.username}/${album.id}`}>
            <img src={album.thumbnail} style={styles.thumbnail} />
          </Link>
          <div style={styles.circle}>
            <span style={styles.circleText}>{album.rating}/10</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyList;
