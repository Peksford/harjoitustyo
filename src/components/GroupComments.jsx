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
    <div>
      <NewComment groupId={Number(id)} />
      {comments &&
        comments.map((comment) => (
          <div key={comment.id}>
            {comment.user && comment.user.username}: {comment.comment}
            <hr />
          </div>
        ))}
    </div>
  );
};

export default GroupComments;
