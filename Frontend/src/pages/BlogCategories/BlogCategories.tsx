import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";
import TableCategory from "../../components/Table/TableCategory";

const BlogCategories = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewActiveCategories, setViewActiveCategories] = useState(true);
    const [isChangedCategory, setIsChangedCategory] = useState(false);

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;

    const navigate = useNavigate();
  
    const toast = useRef(null);

    useEffect(() => {

      if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
      if( currentToken?.user.isUser ) navigate('/app/emergency-request');

      const getCategories = async () => {
        try {
          let response;
          console.log(viewActiveCategories);
          if (viewActiveCategories) {
              response = await apiRequestAuth.get("/blog/categories", {
                  headers: {
                      Authorization: `Bearer ${currentToken?.token}`,
                  },
              });
          } else {
              response = await apiRequestAuth.post("/blog/categories/inactive-categories", {}, {
              headers: {
                  Authorization: `Bearer ${currentToken?.token}`,
              },
              });
          }
          if (response) setCategories(response.data);
          setLoading(false);
        } catch (error) {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Ha ocurrido un error al obtener los registros' });      
        }
      }

        getCategories()
    }, [isChangedCategory, viewActiveCategories])
    
  return (
    <>
      <Toast ref={toast} />
      <TableCategory
        data={categories}
        loading={loading} 
        viewActiveCategories={viewActiveCategories}
        setViewActiveCategories={setViewActiveCategories}
        isChangedCategory={isChangedCategory}
        setIsChangedCategory={setIsChangedCategory}
      />
    </>
  )
}

export default BlogCategories