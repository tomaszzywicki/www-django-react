/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import api from "../api";
import "../styles/CommentsSection.css";

const CommentsSection = ({ bookId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
  }, [bookId]);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/api/user/");
      setCurrentUser(res.data.username);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/book/${bookId}/comments/`);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    try {
      const res = await api.post(`/api/book/${bookId}/comments/`, {
        text: newComment,
      });
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Musisz być zalogowany, aby dodać komentarz.");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/api/comments/${commentId}/`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Nie udało się usunąć komentarza.");
    }
  };

  return (
    <div className="comments-section">
      <h2>Komentarze</h2>
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Dodaj swój komentarz..."
          required
        ></textarea>
        <button type="submit">Dodaj Komentarz</button>
      </form>
      {loading ? (
        <div className="comments-loading">Ładowanie komentarzy...</div>
      ) : comments.length > 0 ? (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-header">
                <p className="comment-user">{comment.user}</p>
                {currentUser === comment.user && (
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(comment.id)}
                  >
                    Usuń
                  </button>
                )}
              </div>
              <p className="comment-text">{comment.text}</p>
              <p className="comment-date">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-comments">Brak komentarzy.</div>
      )}
    </div>
  );
};

export default CommentsSection;
