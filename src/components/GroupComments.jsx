import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setComments } from '../reducers/commentReducer';

import commentService from '../services/comments';
import NewComment from './CommentForm';

const GroupComments = () => {
  const { id } = useParams();

  const comments = useSelector((state) => state.comments);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await commentService.getComments(id);
        dispatch(setComments(comments));
      } catch (error) {
        console.error(error);
      }
    };
    fetchComments();
  }, [id]);

  return (
    <div>
      <h2>Comments</h2>
      <NewComment groupId={Number(id)} />
      {comments &&
        comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              padding: '10px 15px',
              marginTop: '10px',
              borderLeft: '4px solid #b8860b',
              backgroundColor: '#fff',
              borderRadius: '6px',
            }}
          >
            {comment.user && (
              <strong style={{ color: '#333' }}>
                <Link to={`/${comment.user.username}`}>
                  {comment.user.username}
                </Link>
              </strong>
            )}
            :{' '}
            <p style={{ margin: '5px 0 0 0', color: '#555' }}>
              {comment.comment}
            </p>
          </div>
        ))}
    </div>
  );
};

export default GroupComments;
