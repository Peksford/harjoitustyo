import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setComments } from '../reducers/commentReducer';

import commentService from '../services/comments';
import NewComment from './CommentForm';

const GroupComments = () => {
  // const [comments, setComments] = useState('');
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
    <div

    // style={{
    //   marginTop: '30px',
    //   padding: '20px',
    //   // backgroundColor: '#A9A9A9',
    //   borderRadius: '10px',
    //   boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    // }}
    >
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
              <strong style={{ color: '#333' }}>{comment.user.username}</strong>
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
