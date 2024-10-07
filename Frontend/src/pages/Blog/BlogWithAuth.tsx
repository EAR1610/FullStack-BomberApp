import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from '../../interface/Auth';
import { AuthContext } from '../../context/AuthContext';
import { apiRequestAuth } from '../../lib/apiRequest';
import { handleErrorResponse } from "../../helpers/functions";
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import ViewPost from "./ViewPost";

const BlogWithAuth = () => {
  const [selectedCategory, setSelectedCategory] = useState("Salud");
  const [selectedPost, setSelectedPost] = useState(null);
  const [errorMessages, setErrorMessages] = useState<string>('');
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [imagePreviews, setImagePreviews] = useState<{ [key: number]: string }>({});
  const [loadingImages, setLoadingImages] = useState(true);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;
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
  }, [currentToken]);

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
    } catch (err) {
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
    } catch (err) {
      showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
    }
  };

  const viewPostBlog = async (post: any) => {
    setViewPost(true);
    setSelectedPost(post);
  };

  return (
    <div className="container mx-auto p-6">
      <Toast ref={toast} />
      {/* Barra de categorías */}
      <div className="flex justify-center space-x-4 mb-8">
        {categories?.map((category) => (
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
        ))}
      </div>

      {/* Sección de posts en formato de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Mostrar la imagen si ya se ha cargado */}
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
            </div>
          </div>
        ))}
      </div> 
      <Dialog header={'Post'} visible={viewPost} onHide={() => setViewPost(false)}
        style={{ width: '75vw' }} breakpoints={{ '641px': '100vw' }}>
        <ViewPost 
          post = {selectedPost}
        />
      </Dialog>     
    </div>
  );
};

export default BlogWithAuth;
