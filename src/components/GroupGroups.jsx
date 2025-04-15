import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const styles = {
  thumbnail: {
    width: '140px',
    height: '150px',
    marginRight: '1rem',
  },
};

const GroupGroups = ({ sortedGroups }) => {
  return (
    <div>
      {sortedGroups &&
        sortedGroups.map((group) => (
          <div key={group.id}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              <Link to={`/clubs/${group.id}`}>
                <img src={group.thumbnail} style={styles.thumbnail} />
              </Link>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Link to={`/clubs/${group.id}`}>{group.name}</Link>
                <div style={{ textTransform: 'capitalize' }}>
                  {group.item_type} <br />
                  Members:
                  <ul>
                    {(group.group_members || group.members).map((member) => (
                      <li key={member.id}>
                        {member.user ? member.user.username : member.username}
                      </li>
                    ))}
                  </ul>
                  {new Date(group.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <hr />
          </div>
        ))}
    </div>
  );
};

GroupGroups.propTypes = {
  sortedGroups: PropTypes.array,
  added: PropTypes.object,
};

export default GroupGroups;
