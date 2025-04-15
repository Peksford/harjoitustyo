import React from 'react';
import PropTypes from 'prop-types';
import UserGroupAlbum from './UserGroupAlbum';
import UserGroupMovie from './UserGroupMovie';
import UserGroupBook from './UserGroupBook';
import UserGroupGame from './UserGroupGame';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserGroup = ({ createObject }) => {
  const { id } = useParams();
  const groups = useSelector((state) => state.groups);

  const group = groups.find((item) => item.id === Number(id));

  if (group) {
    return (
      <div>
        {group.item_type === 'album' && (
          <UserGroupAlbum createAlbum={createObject} />
        )}
        {group.item_type === 'movie' && (
          <UserGroupMovie createMovie={createObject} />
        )}
        {group.item_type === 'book' && (
          <UserGroupBook createBook={createObject} />
        )}
        {group.item_type === 'game' && (
          <UserGroupGame createGame={createObject} />
        )}
      </div>
    );
  }
};

UserGroup.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  onUpdateGroup: PropTypes.func,
  createObject: PropTypes.func.isRequired,
};

export default UserGroup;
