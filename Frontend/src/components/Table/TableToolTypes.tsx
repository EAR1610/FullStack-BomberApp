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
import ToolType from '../../pages/ToolType/ToolType';
import ViewToolType from '../../pages/ToolType/ViewToolType';
import { createLog, handleErrorResponse } from '../../helpers/functions';

const TableToolTypes = ({ data, viewActiveToolsType, setViewActiveToolsType, loading, isChangedToolType, setIsChangedToolType } :any) => {
 
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.STARTS_WITH }        
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [visibleToolType, setVisibleToolType] = useState(false);
  const [selectedToolType, setSelectedToolType] = useState(null);
  const [isInactiveToolType, setIsInactiveToolType] = useState(false);

  const toast = useRef(null);  

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;
  const userId = currentToken?.user?.id || 1;
  const [errorMessages, setErrorMessages] = useState<string>('');

  useEffect(() => {
    if( selectedToolType && isInactiveToolType ) {
      confirmDialog({
        message: `${!viewActiveToolsType ? '¿Desea activar este registro?' : '¿Desea inactivar este registro?'}`,
        header: `${!viewActiveToolsType ? 'Confirma la activación' : 'Confirma la inactivación'}`,
        icon: 'pi pi-info-circle',
        acceptClassName: `${!viewActiveToolsType ? 'p-button-success' : 'p-button-danger'}`,
        accept,
        reject,
        onHide: () => setIsInactiveToolType(false)
      });   
    }
  }, [selectedToolType]);  

  const onGlobalFilterChange = (e:any) => {
      const value = e.target.value;
      let _filters = { ...filters };

      _filters['global'].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
          <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
          </IconField>
          <IconField iconPosition="left" className='ml-2'>                
                <InputIcon className="pi pi-search" />
                <Button label="Crear un nuevo registro" icon="pi pi-check" loading={loading} onClick={() => newToolType()} className='' />
                <Button label={viewActiveToolsType ? 'Ver registros inactivos' : 'Ver registros activas'} icon="pi pi-eye" loading={loading} onClick={() => viewActiveOrInactiveToolsType() } className='ml-2' severity={viewActiveToolsType ? 'danger' : 'success'} />
          </IconField>
      </div>
    );
  };

  const newToolType = () => {
    setVisible(true);
    setSelectedToolType(null);
  }

  const viewActiveOrInactiveToolsType = () => setViewActiveToolsType(!viewActiveToolsType);    

  const editToolsType = (toolType: any) => {
    setVisible(true);
    setSelectedToolType(toolType);
  }

  const deleteToolsType = async (rowData:any) => {    
    setSelectedToolType(rowData);
    setIsInactiveToolType(true); 
  };

  const showToolsType = (rowData:any) => {
    setVisibleToolType(true);
    setSelectedToolType(rowData);
  } 

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  const accept = async () => {
    if (!selectedToolType) return;
  
    const status = viewActiveToolsType ? 'inactive' : 'active';
    const formData = new FormData();
    formData.append('name', selectedToolType.name);
    formData.append('status', status);

    try {
      await apiRequestAuth.put(`/tool-type/${selectedToolType.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentToken?.token}`,
        },
      });
  
      const message = status === 'active' ? 'Se ha activado el registro' : 'Se ha desactivado el registro';
      await createLog(userId, 'ACTUALIZAR', 'TIPO DE HERRAMIENTA', `Se ha ${status === 'active' ? 'activado' : 'desactivado'} el registro del tipo de herramienta: ${selectedToolType?.name}`, currentToken?.token);
      setIsChangedToolType(!isChangedToolType);
      showAlert('info', 'Info', message);
    } catch (error) {
      showAlert('error', 'Error', handleErrorResponse(error, setErrorMessages));
    }
  }; 
  
  const reject = () => showAlert('warn', 'Rechazado', 'Has rechazado el proceso');
  
  const optionsBodyTemplate = (rowData:any) => {
    return (
      <div className="flex items-center space-x-4">
          <Button
              size='small'
              icon="pi pi-pencil"
              className="p-button-rounded p-button-success p-button-sm"
              onClick={() => editToolsType(rowData)}
              style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
          />
          <Button
              size='small'
              icon="pi pi-eye"
              className="p-button-rounded p-button-warning p-button-sm"
              onClick={() => showToolsType(rowData)}
              style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
          />
          <Button
              size='small'
              icon={viewActiveToolsType ? 'pi pi-trash' : 'pi pi-check'}
              className={viewActiveToolsType ? 'p-button-rounded p-button-danger p-button-sm' : 'p-button-rounded p-button-info p-button-sm'}
              onClick={() => deleteToolsType(rowData)}
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
        <Column field="name" header="Nombre"  style={{ minWidth: '12rem' }}  align={'center'} />
        <Column field="status" header="Estado" style={{ minWidth: '12rem' }} align={'center'} />
        <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '12rem' }} />
      </DataTable>
      <Dialog header={selectedToolType ? 'Actualizar el tipo de herramienta' : 'Creación del tipo de herramienta'} visible={visible} onHide={() => setVisible(false)} 
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <ToolType toolType={selectedToolType} setVisible={setVisible} isChangedToolType={isChangedToolType} setIsChangedToolType={setIsChangedToolType} />
      </Dialog>
      <Dialog header="Visualizando el tipo de herramienta" visible={visibleToolType} onHide={() => setVisibleToolType(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <ViewToolType toolType={selectedToolType} />
      </Dialog>
    </div>
  )
}

export default TableToolTypes