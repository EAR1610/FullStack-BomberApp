import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from '../../interface/Auth';
import { AuthContext } from '../../context/AuthContext';
import { apiRequestAuth, socketIoURL } from '../../lib/apiRequest';
import { createLog, handleErrorResponse } from "../../helpers/functions";
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import ViewPost from "./ViewPost";
import { io } from "socket.io-client";

const BlogWithAuth = () => {
  const [selectedCategory, setSelectedCategory] = useState<String>("Salud");
  const [selectedPost, setSelectedPost] = useState(null);
  const [errorMessages, setErrorMessages] = useState<string>('');
  const [posts, setPosts] = useState<any[]>([]);
  const [postsChanged, setPostsChanged] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [imagePreviews, setImagePreviews] = useState<{ [key: number]: string }>({});
  const [loadingImages, setLoadingImages] = useState(true);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;
  const userId = currentToken?.user?.id || 1;
  const [viewPost, setViewPost] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await apiRequestAuth.get("/blog/categories", {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        setCategories(response.data);
      } catch (err) {
        showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
      }
    };   

    const getPosts = async () => {
      try {
        const response = await apiRequestAuth.get(`/blog/posts`, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        setPosts(response.data);
      
        const fetchImages = async () => {
          const promises = response.data.map(async (post: any) => {
            await fetchUserImage(post.img, post.id);
          });
          await Promise.all(promises);
          setLoadingImages(false);
        };
        fetchImages();
      } catch (err) {
        showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
      }
    };
    
    getPosts();
    getCategories();
  }, [postsChanged]);

  useEffect(() => {
    const socket = io(socketIoURL);
  
    const handlePostCreated = async (newPost:any) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      showAlert('info', 'Info', 'Nuevo post creado');

      if (newPost.img) await fetchUserImage(newPost.img, newPost.id);    
    };
  
    const handlePostUpdated = (updatedPost:any) => {
      setPosts((prevPosts) =>
        prevPosts.filter(post => post.id !== updatedPost.id || updatedPost.status !== 'inactive')
      );
      showAlert('info', 'Info', 'Post actualizado');
    };
  
    socket.on('postCreated', handlePostCreated);
    socket.on('postUpdated', handlePostUpdated);
  
    return () => {
      socket.off('postCreated', handlePostCreated);
      socket.off('postUpdated', handlePostUpdated);
      socket.disconnect();
    };
  }, []);

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  const fetchUserImage = async (img: string, postId: number) => {
    try {
      const response = await apiRequestAuth.post(`/blog/posts/img-posts/${img}`, {}, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentToken?.token}`
        },
        responseType: 'blob'
      });
      const imageBlob = response.data;
      const imageObjectUrl = URL.createObjectURL(imageBlob);

      setImagePreviews((prevState) => ({
        ...prevState,
        [postId]: imageObjectUrl
      }));
    } catch (error) {
      console.error('Error fetching user image:', error);
    }
  };

  const getAllPostsByCategoryId = async (category: any) => {
    try {
      setSelectedCategory(category.name);
      const response = await apiRequestAuth.post(`/blog/posts/all-posts-by-category-id/${category.id}`, {}, {
        headers: {
          Authorization: `Bearer ${currentToken?.token}`,
        },
      });
      setPosts(response.data);
      
      for (const post of response.data) {
        await fetchUserImage(post.img, post.id);
      }
    } catch (err) {
      console.log(err);
      showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
    }
  };

  const getAllPostsByUserId = async () => {
    try {
      const response = await apiRequestAuth.get(`/blog/posts/all-posts-by-user-id/${currentToken?.user?.id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentToken?.token}`,
        },
      });
      setPosts(response.data);
      
      for (const post of response.data) {
        await fetchUserImage(post.img, post.id);
      }
    } catch (err) {
      console.log(err);
      showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
    }
  };

  const viewPostBlog = async (post: any) => {
    setViewPost(true);
    setSelectedPost(post);
  };

  const deletePost = async (post: any) => {
    try {
      const formData = new FormData();
      formData.append('userId', JSON.stringify(post.userId));
      formData.append('categoryId', JSON.stringify(post.categoryId));
      formData.append('title', post.title);
      formData.append('desc', post.desc);
      formData.append('img', post.img);
      formData.append('status', 'inactive');
      await apiRequestAuth.put(`/blog/posts/${post.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentToken?.token}`,
        },
      });
      showAlert('info', 'Info', 'Post borrado');
      setPostsChanged(!postsChanged);
      createLog(userId, 'ELIMINACIÓN', 'POST', `Se ha borrado el post: ${post.title}`, currentToken?.token);
    } catch (error) {
      console.log(error);
      showAlert('error', 'Error', handleErrorResponse(error, setErrorMessages));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Toast ref={toast} />

      {/* Barra de categorías */}
      <div className="flex justify-center space-x-4 mb-8">
        {categories.length > 0 ? (
          categories.map((category) => (
            <button
              key={category.id}
              onClick={() => getAllPostsByCategoryId(category)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                selectedCategory === category.name
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category.name}
            </button>
          ))
        ) : (
          <div className="flex items-center justify-center p-4 rounded-lg bg-red-100 border border-red-300 text-red-600 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m2 0h.01M12 18h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"
              />
            </svg>
            <span>No hay categorías disponibles</span>
          </div>
        )}
      </div>

      {/* Sección de posts en formato de cards */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {imagePreviews[post.id] ? (
                <img
                  src={imagePreviews[post.id]}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span>Cargando imagen...</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <button
                  onClick={() => viewPostBlog(post)}
                  className="mt-4 inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition w-full"
                >
                  Ver post
                </button>
                {currentToken?.user.isAdmin && (
                  <button
                    onClick={() => deletePost(post)}
                    className="mt-4 inline-block bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition w-full"
                  >
                    Borrar post
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-12">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mb-4 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
            <p className="text-xl text-gray-500 font-semibold">No hay publicaciones disponibles</p>
            <p className="text-gray-400">Vuelve más tarde para ver las nuevas publicaciones.</p>
          </div>
        </div>
      )}

      <Dialog header={'Post'} visible={viewPost} onHide={() => setViewPost(false)}
        style={{ width: '75vw' }} breakpoints={{ '641px': '100vw' }}>
        <ViewPost 
          post={selectedPost}
        />
      </Dialog>
    </div>
  );
};

export default BlogWithAuth;
