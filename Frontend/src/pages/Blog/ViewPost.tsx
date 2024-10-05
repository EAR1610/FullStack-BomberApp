import { useContext, useEffect, useState } from "react";
import { apiRequestAuth } from "../../lib/apiRequest";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { Editor } from 'primereact/editor';

const ViewPost = ({ post }: any) => {

  const [errorMessages, setErrorMessages] = useState<string>('');
  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;
  const userId = currentToken?.user?.id || 1;
  const [imagePreview, setImagePreview] = useState<null | string>(null);

  useEffect(() => {
    fetchUserImage(post.img);
  }, []);

  const fetchUserImage = async (photography: string) => {
    try {
        const response = await apiRequestAuth.post(`/blog/posts/img-posts/${photography}`, {}, {
        headers: {
            Authorization: `Bearer ${currentToken?.token}`
        },
        responseType: 'blob'
        });
        const imageBlob = response.data;
        const imageObjectUrl = URL.createObjectURL(imageBlob);
        setImagePreview(imageObjectUrl);
    } catch (error) {
        console.error('Error fetching user image:', error);
    }
  };

    return (
      <div className="container mx-auto p-6">
        {/* Título del post */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Publicado el: {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
  
        {/* Imagen destacada */}
        <div className="mb-6">
          <img
            src={imagePreview}
            alt={post.title}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
  
        {/* Descripción del post */}
        <div className="prose prose-lg max-w-none text-gray-800 dark:text-gray-300">
        <Editor value={post.desc} style={{ height: '320px' }} readOnly />
        </div>
      </div>
    );
};
  
  export default ViewPost;
  