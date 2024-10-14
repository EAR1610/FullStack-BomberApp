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
import OriginType from '../../pages/OriginType/OriginType';
import ViewOriginType from '../../pages/OriginType/ViewOriginType';
import { createLog, handleErrorResponse } from '../../helpers/functions';
import { useNavigate } from 'react-router-dom';

const TableOriginTypes = ({ data, viewActiveOriginTypes, setViewActiveOriginTypes, loading, isChangedOriginType, setIsChangedOriginType } : any) => {
    
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.STARTS_WITH }        
      });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [visibleOriginType, setVisibleOriginType] = useState(false);
    const [selectedOriginType, setSelectedOriginType] = useState(null);
    const [isInactiveOriginType, setIsInactiveOriginType] = useState(false);

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
    }, [])    

    useEffect(() => {
      if( selectedOriginType && isInactiveOriginType ){
        confirmDialog({
          message: `${!viewActiveOriginTypes ? '¿Desea activar este registro?' : '¿Desea inactivar este registro?'}`,
          header: `${!viewActiveOriginTypes ? 'Confirma la activación' : 'Confirma la inactivación'}`,
          icon: 'pi pi-info-circle',
          acceptClassName: `${!viewActiveOriginTypes ? 'p-button-success' : 'p-button-danger'}`,
          accept,
          reject,
          onHide: () => setIsInactiveOriginType(false)
        });
      }
    }, [selectedOriginType, isInactiveOriginType]);    

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
          <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
          </IconField>
          <IconField iconPosition="left" className='ml-2'>                
                <InputIcon className="pi pi-search" />
                <Button label="Crear un nuevo registro" icon="pi pi-check" loading={loading} onClick={() => newOriginType()} className='' />
                <Button label={viewActiveOriginTypes ? 'Ver registros inactivos' : 'Ver registros activas'} icon="pi pi-eye" loading={loading} onClick={() => viewActiveOrInactiveOriginTypes()} className='ml-2' severity={viewActiveOriginTypes ? 'danger' : 'success'} />             
          </IconField>
      </div>
    );
  };

  const newOriginType = () => {
    setVisible(true);
    setSelectedOriginType(null);
  };

  const viewActiveOrInactiveOriginTypes = () => setViewActiveOriginTypes(!viewActiveOriginTypes);

  const editOriginType = (rowData: any) => {
    setVisible(true);
    setSelectedOriginType(rowData);
  };

  const deleteOriginType = async (rowData:any) => {    
    setSelectedOriginType(rowData);
    setIsInactiveOriginType(true);          
  };

  const showOriginType = (rowData:any) => {
    setSelectedOriginType(rowData);
    setVisibleOriginType(true);
  };   

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  const accept = async () => {
    if (!selectedOriginType) return;
  
    const formData = new FormData();
    formData.append('name', selectedOriginType.name);
    const status = viewActiveOriginTypes ? 'inactive' : 'active';
    formData.append('status', status);
  
    try {
      await apiRequestAuth.put(`/origin-type/${selectedOriginType.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentToken?.token}`,
        },
      });
  
      const message = status === 'active' ? 'Se ha activado el registro' : 'Se ha desactivado el registro';
      await createLog(userId, 'ACTUALIZAR', 'TIPO DE ORIGEN', `Se ha ${status === 'active' ? 'activado' : 'desactivado'} el registro del tipo de origen: ${selectedOriginType?.name}`, currentToken?.token);
      
      setIsChangedOriginType(!isChangedOriginType);
      showAlert('info', 'Info', message);
    } catch (error) {
      showAlert('error', 'Error', handleErrorResponse(error, setErrorMessages));
    }
  }

  const reject = () => showAlert('warn', 'Rechazado', 'Se ha rechazado el proceso');

  const optionsBodyTemplate = (rowData:any) => {
    return (
      <div className="flex items-center space-x-4">
          <Button
              size='small'
              icon="pi pi-pencil"
              className="p-button-rounded p-button-success p-button-sm"
              onClick={() => editOriginType(rowData)}
              style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
          />
          <Button
              size='small'
              icon="pi pi-eye"
              className="p-button-rounded p-button-warning p-button-sm"
              onClick={() => showOriginType(rowData)}
              style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
          />
          <Button
              size='small'
              icon={viewActiveOriginTypes ? 'pi pi-trash' : 'pi pi-check'}
              className={viewActiveOriginTypes ? 'p-button-rounded p-button-danger p-button-sm' : 'p-button-rounded p-button-info p-button-sm'}
              onClick={() => deleteOriginType(rowData)}
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
        globalFilterFields={['name', 'status']}
        header={header}
        emptyMessage="Registro no encontrado."
      >
        <Column field="name" header="Nombre"  style={{ minWidth: '12rem' }}  align={'center'}/>
        <Column field="status" header="Estado" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '12rem' }} />       
      </DataTable>
      <Dialog header={selectedOriginType ? 'Actualizar el tipo de origen' : 'Creación del tipo de origen'} visible={visible} onHide={() => setVisible(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <OriginType originType={selectedOriginType} setVisible={setVisible} isChangedOriginType={isChangedOriginType} setIsChangedOriginType={setIsChangedOriginType} />
      </Dialog>
      <Dialog header="Visualización del tipo de origen" visible={visibleOriginType} onHide={() => setVisibleOriginType(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <ViewOriginType originType={selectedOriginType} />
      </Dialog>
    </div>
  )
}

export default TableOriginTypes