import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { handleErrorResponse } from "../../helpers/functions";
import { Toast } from "primereact/toast";

const CreateBlog = () => {

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Salud");
  const [errorMessages, setErrorMessages] = useState<string>('');
  const [categoryId, setCategoryId] = useState(0);
  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;
  const userId = currentToken?.user?.id || 1;

  const toast = useRef(null);

  const [title, setTitle] = useState(''); 
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [description, setDescription] = useState('')

  useEffect(() => {
    const getCategories = async () => { 
        const response = await apiRequestAuth.get("/blog/categories", {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        setCategories(response.data);
        console.log(response.data);
    }
    getCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    debugger;
    const formData = new FormData();
    formData.append('userId', JSON.stringify(userId));
    formData.append('categoryId', JSON.stringify(categoryId));
    formData.append('title', title);
    formData.append('desc', description);
    if (image) formData.append('img', image);
    formData.append('status', "active");

    try {
        await apiRequestAuth.post("/blog/posts", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${currentToken?.token}`,
            },
        });
        showAlert('info', 'Info', 'Publicación creada exitosamente');
    } catch (err) {
        console.log(err);
        showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
    }
  };

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  const selectedCategoryTemplate = (option:any, props:any) => {
    if (option) {
        return (
            <div className="flex align-items-center">
                <span className="mr-2">{option.name}</span>
            </div>
        );
    }

    return <span>{props.placeholder}</span>;
  };

  const categoryOptionTemplate = (option:any) => {
      return (
          <div className="flex align-items-center">
              <span className="mr-2">{option.name}</span>
          </div>
      );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleCategoryChange = (e:any) => setCategoryId(e.value.id);
  const selectedCat = categories.find(category => category.id === categoryId);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Toast ref={toast} />
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Crear Nueva Publicación</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-2">Título</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ingresa el título de la publicación"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-lg font-semibold text-gray-700 mb-2">Categoría</label>
          <Dropdown
            value={selectedCat}
            onChange={handleCategoryChange}
            options={categories}
            optionLabel="name"
            placeholder="Selecciona una categoría"
            filter
            valueTemplate={selectedCategoryTemplate}
            itemTemplate={categoryOptionTemplate}
            className="w-full md:w-14rem"
            required            
            />
        </div>

        <div>
          <label htmlFor="image" className="block text-lg font-semibold text-gray-700 mb-2">Imagen</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imagePreview && (
            <div className="mt-4">
              <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg shadow-md" />
            </div>
          )}
        </div>

        {/* Campo Descripción (React Quill) */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Descripción</label>
          <Editor value={description} onTextChange={(e) => setDescription(e.htmlValue)} style={{ height: '320px' }} />
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Crear Post
        </button>
      </form>
    </div>
  )
}

export default CreateBlog