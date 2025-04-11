import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment, setComments } from '../reducers/commentReducer';
import commentService from '../services/comments';
import PropTypes from 'prop-types';

const NewComment = ({ groupId }) => {
  const [newComment, setNewComment] = useState('');

  const dispatch = useDispatch();

  const createComment = async (event) => {
    event.preventDefault();

    dispatch(addComment(groupId, newComment));

    const updatedComments = await commentService.getComments(groupId);

    dispatch(setComments(updatedComments));

    // setNewComment('');
  };

  const definedComments = [
    'Shite',
    'Not my cup of tea',
    'Timeless classic',
    'Average',
    'Snoozefest',
    'Overhyped but ok',
    'Solid background noise',
    'I wanted to like it...',
    'Banger',
    'Put this in a time capsule',
    'Masterpiece',
    'How is this even real??',
    'This raised the bar for everything else',
    'Made me forget real life for a while',
    'S-tier content',
    'I wish I could experience it again for the first time',
    'meh',
    'Good effort I guess',
    "I've seen worse... and better",
    'Not bad not great',
    'Painful... emotionally, spiritually, artistically',
    '0/0',
  ];

  const handleChange = (e) => {
    setNewComment(e.target.value);
  };

  return (
    <form
      style={{ marginTop: '10px', marginBottom: '10px' }}
      onSubmit={createComment}
    >
      <div>
        <select
          name="comment"
          value={newComment}
          onChange={handleChange}
          style={{ width: '50%', marginTop: '10px' }}
        >
          <option value="" disabled>
            Any thoughts?
          </option>
          {definedComments.map((comment) => (
            <option key={comment} value={comment}>
              {comment}
            </option>
          ))}
        </select>
        <button style={{ marginLeft: '10px' }} type="submit">
          Add comment
        </button>
      </div>
    </form>
  );
};

NewComment.propTypes = {
  groupId: PropTypes.number.isRequired,
};

export default NewComment;
