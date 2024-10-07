import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth, socketIoURL } from "../../lib/apiRequest";
import { Comment } from "../../helpers/Interfaces";
import { Toast } from "primereact/toast";
import { handleErrorResponse } from "../../helpers/functions";
import { io } from 'socket.io-client';

const CommentsByPost = ({ postId }: { postId: number }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newCommentStatus, setNewCommentStatus] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string>('');
  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;
  const userId = currentToken?.user?.id || 1;
  const toast = useRef(null);

  useEffect(() => {
    const getCommentsByPostId = async () => {
      try {
        const response = await apiRequestAuth.post(`/blog/comments/all-comments-by-post-id/${postId}`, {}, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        setComments(response.data);
        setNewCommentStatus(!newCommentStatus);
      } catch (err) {
        console.log(err);
      }
    };

    getCommentsByPostId();
  }, [postId, currentToken, newCommentStatus]);

  useEffect(() => {
    const socket = io(socketIoURL);
    socket.on('commentCreated', (newComment) => {
      setComments([newComment, ...comments]);      
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showAlert('warn', 'Error', 'El comentario no puede estar vacío.');
      return;
    }
    try {
        const formData = new FormData();
        formData.append('postId', JSON.stringify(postId));
        formData.append('userId', JSON.stringify(userId));
        formData.append('content', newComment);
        formData.append('status', 'active');
      const response = await apiRequestAuth.post(`/blog/comments/`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken?.token}`,
        },
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.log(err);
      showAlert('warn', 'Error', handleErrorResponse(err, setErrorMessages));
    }
  };

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  return (
    <div className="mt-8">
      <Toast ref={toast} />
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Comentarios</h2>

      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment?.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition duration-300 hover:shadow-xl hover:scale-105 transform">
              <div className="flex items-center mb-3">
                <div className="mr-3">
                  {/* Icono con la inicial del nombre */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 text-white flex items-center justify-center font-bold">
                    {comment?.user?.fullName[0]}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Publicado por: {comment?.user?.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()} - {new Date(comment.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{comment?.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">Aún no hay comentarios.</p>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Escribe un comentario</h3>
        
        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="Escribe tu comentario aquí..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={5}
          />

          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 w-full"
          >
            Enviar comentario
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentsByPost;
