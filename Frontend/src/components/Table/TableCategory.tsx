import { useState, useContext, useRef, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import 'primeicons/primeicons.css';      
import { AuthContextProps } from '../../interface/Auth';
import { AuthContext } from '../../context/AuthContext';
import { apiRequestAuth } from '../../lib/apiRequest';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { createLog, handleErrorResponse } from '../../helpers/functions';
import BlogCategory from '../../pages/BlogCategories/BlogCategory';
import ViewCategory from '../../pages/BlogCategories/ViewCategory';
import { useNavigate } from 'react-router-dom';

const TableCategory = ({ data, viewActiveCategories, setViewActiveCategories, loading, isChangedCategory, setIsChangedCategory }: any) => {

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.STARTS_WITH }        
      });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [visibleCategory, setVisibleCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isInactiveCategory, setIsInactiveCategory] = useState(false);

    const toast = useRef(null);  

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;
    const userId = currentToken?.user?.id || 1;
    const [errorMessages, setErrorMessages] = useState<string>('');
    const navigate = useNavigate();


    const onGlobalFilterChange = (e:any) => {
        const value = e.target.value;
        let _filters = { ...filters };
  
        _filters['global'].value = value;
  
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    useEffect(() => {
      const verificarToken = async () => {
        if( currentToken) {
          if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
          if( currentToken?.user.isUser ) navigate('/app/emergency-request');
        }
      }
      verificarToken();
    }, []);
    

    useEffect(() => {
        if( selectedCategory && isInactiveCategory ){
          confirmDialog({
            message: `${!viewActiveCategories ? '¿Desea activar este registro?' : '¿Desea inactivar este registro?'}`,
            header: `${!viewActiveCategories ? 'Confirma la activación' : 'Confirma la inactivación'}`,
            icon: 'pi pi-info-circle',
            acceptClassName: `${!viewActiveCategories ? 'p-button-success' : 'p-button-danger'}`,
            accept,
            reject,
            onHide: () => setIsInactiveCategory(false),
          });
        }
      }, [selectedCategory]);

      const renderHeader = () => {
        return (
          <div className="flex justify-content-between">
              <IconField iconPosition="left">
                  <InputIcon className="pi pi-search" />
                  <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
              </IconField>
              <IconField iconPosition="left" className='ml-2'>                
                    <InputIcon className="pi pi-search" />
                    <Button label="Crear un nuevo registro" icon="pi pi-check" loading={loading} onClick={() => newCategory()} className='' />
                    <Button label={viewActiveCategories ? 'Ver registros inactivos' : 'Ver registros activas'} icon="pi pi-eye" loading={loading} onClick={() => viewActiveOrInactiveCategory() } className='ml-2' severity={viewActiveCategories ? 'danger' : 'success'} />
                  <Dialog header="Header" visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}> 
                </Dialog>
              </IconField>
          </div>
        );
      };

      const newCategory = () => {
        setVisible(true);
        setSelectedCategory(null);
      }

      const viewActiveOrInactiveCategory = () => {
        console.log(viewActiveCategories);
        setViewActiveCategories(!viewActiveCategories);
      }

      const editCategory = (category: any) => {
        setVisible(true);
        setSelectedCategory(category);
      }

      const deleteCategory = async (rowData:any) => { 
        setSelectedCategory(rowData);
        setIsInactiveCategory(true);
      };

      const showCategory = (rowData:any) => {
        setVisibleCategory(true);
        setSelectedCategory(rowData);
      }

      const accept = async () => {
        if (selectedCategory) {
          const formData = new FormData();
          const status = !viewActiveCategories ? 'active' : 'inactive';
          const message = !viewActiveCategories ? 'Se ha activado el registro' : 'Se ha desactivado el registro';
      
          try {
            formData.append('name', selectedCategory.name);
            formData.append('description', selectedCategory.description);
            formData.append('status', status);
      
            await apiRequestAuth.put(`/blog/categories/${selectedCategory.id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${currentToken?.token}`,
              },
            });
            await createLog(userId, 'ACTUALIZAR', 'CATEGORIA', `Se ha actualizado la informacion de la categoría: ${selectedCategory.name}`, currentToken?.token);
            setIsChangedCategory(!isChangedCategory);
            showAlert('info', 'Info', message);
          } catch (err) {
            showAlert('warn', 'Error', handleErrorResponse(err, setErrorMessages));
          }
        }
      }

    const reject = () => showAlert('warn', 'Rechazado', 'Has rechazado el proceso');

    const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

    const optionsBodyTemplate = (rowData:any) => {
        return (
          <div className="flex items-center space-x-4">
              <Button
                  size='small'
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-success p-button-sm"
                  onClick={() => editCategory(rowData)}
                  style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              />
              <Button
                  size='small'
                  icon="pi pi-eye"
                  className="p-button-rounded p-button-warning p-button-sm"
                  onClick={() => showCategory(rowData)}
                  style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              />
              <Button
                  size='small'
                  icon={viewActiveCategories ? 'pi pi-trash' : 'pi pi-check'}
                  className={viewActiveCategories ? 'p-button-rounded p-button-danger p-button-sm' : 'p-button-rounded p-button-info p-button-sm'}
                  onClick={() => deleteCategory(rowData)}
                  style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              />
          </div>
      )};

    const header = renderHeader();

  return (
    <div className="card p-4 bg-gray-100 rounded-lg shadow-md">
      <Toast ref={toast} />
      <ConfirmDialog />
      <DataTable
       className='bg-white rounded-md overflow-hidden'
        value={data}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        loading={loading}
        globalFilterFields={['name', 'description', 'status']}
        header={header}
        emptyMessage="Registro no encontrado."
      >
        <Column field="name" header="Nombre"  style={{ minWidth: '12rem' }}  align={'center'} />
        <Column field="description" header="Descripción"  style={{ minWidth: '12rem' }}  align={'center'} />
        <Column field="status" header="Estado" style={{ minWidth: '12rem' }} align={'center'} />
        <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '12rem' }} />
      </DataTable>
      <Dialog header="Gestión de Categorías" visible={visible} onHide={() => setVisible(false)}
        style={{ width: '75vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <BlogCategory
          category={selectedCategory}
          setVisible={setVisible} 
          isChangedCategory={isChangedCategory} 
          setIsChangedCategory={setIsChangedCategory}          
        />
      </Dialog>
      <Dialog header="Información de la Categoría" visible={visibleCategory} onHide={() => setVisibleCategory(false)}
        style={{ width: '75vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <ViewCategory category={selectedCategory} />
      </Dialog>
    </div>
  )
}

export default TableCategory