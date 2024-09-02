import { useState, useEffect, useContext, useRef } from 'react';
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
import Tool from '../../pages/Tool/Tool';
import ViewTool from '../../pages/Tool/ViewTool';

const TableTools = ({ data, viewActiveTools, setViewActiveTools }:any) => {
  const [tools, setTools] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    brand: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    model: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    serial_number: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [visibleTool, setVisibleTool] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isInactiveTool, setIsInactiveTool] = useState(false);

  const toast = useRef(null);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;  
  
  useEffect(() => {
    const getToolTypes = async () => {
      try {
        const response = await apiRequestAuth.get("/tool-type", {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`
          }
        });
        const toolTypesData = response.data;

        const toolsWithTypeName = data.map(tool => {
          const toolType = toolTypesData.find(type => type.id === tool.toolTypeId);
          return {
            ...tool,
            toolTypeName: toolType ? toolType.name : 'Unknown'
          };
        });
        setTools(toolsWithTypeName);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getToolTypes();
  }, [data]);

  useEffect(() => {
    if( selectedTool && isInactiveTool ){
      confirmDialog({
        message: `${!viewActiveTools ? '¿Desea activar esta herramienta?' : '¿Desea inactivar esta herramienta?'}`,
        header: `${!viewActiveTools ? 'Confirma la activación' : 'Confirma la inactivación'}`,
        icon: 'pi pi-info-circle',
        acceptClassName: `${!viewActiveTools ? 'p-button-success' : 'p-button-danger'}`,
        accept,
        reject,
        onHide: () => setIsInactiveTool(false)
      });  
    }
  }, [selectedTool]);
  

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
                <Button label="Crear nueva herramienta" icon="pi pi-check" loading={loading} onClick={() => newTool()} className='' />
                <Button label={viewActiveTools ? 'Ver herramientas inactivas' : 'Ver herramientas activas'} icon="pi pi-eye" loading={loading} onClick={() => viewActiveOrInactiveTools()} className='ml-2' severity={viewActiveTools ? 'danger' : 'success'} />
              <Dialog header="Header" visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>                  
                <Tool tool={selectedTool} setVisible={setVisible}/>
            </Dialog>
          </IconField>
      </div>
    );
  };

  const newTool = () => {
    setSelectedTool(null);
    setVisible(true);
  }

  const viewActiveOrInactiveTools = () => setViewActiveTools(!viewActiveTools);

  const editTool = (rowData:any) => {
    setSelectedTool(rowData);
    setVisible(true);
  };

  const deleteTool = async (rowData:any) => {    
    setSelectedTool(rowData);
    setIsInactiveTool(true);
  };

  const showTool = (rowData:any) => {
    setSelectedTool(rowData);
    setVisibleTool(true);
  };

  const accept = async () => {
    if (selectedTool) {
      const formData = new FormData();
      try {
        if(!viewActiveTools){
          formData.append('status', 'active');
          await apiRequestAuth.put(`/tool/${selectedTool.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${currentToken?.token}`
            },
          });
          toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Se ha activado la herramienta', life: 3000 });
        } else {
          formData.append('status', 'inactive');
          await apiRequestAuth.put(`/tool/${selectedTool.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${currentToken?.token}`
            },
          });
          toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Se ha desactivado la herramienta', life: 3000 });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const reject = () => toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'Has rechazado el proceso', life: 3000 });  

  const optionsBodyTemplate = (rowData:any) => {
    return (
      <div className="flex items-center space-x-4">
          <Button
              size='small'
              icon="pi pi-pencil"
              className="p-button-rounded p-button-success p-button-sm"
              onClick={() => editTool(rowData)}
              style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
          />
          <Button
              size='small'
              icon="pi pi-eye"
              className="p-button-rounded p-button-warning p-button-sm"
              onClick={() => showTool(rowData)}
              style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
          />
          <Button
              size='small'
              icon={viewActiveTools ? 'pi pi-trash' : 'pi pi-check'}
              className={viewActiveTools ? 'p-button-rounded p-button-danger p-button-sm' : 'p-button-rounded p-button-info p-button-sm'}
              onClick={() => deleteTool(rowData)}
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
        value={tools}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        loading={loading}
        globalFilterFields={['name', 'brand', 'model', 'toolTypeName']}
        header={header}
        emptyMessage="Herramienta no encontrada."
      >
        <Column field="name" header="Nombre"  style={{ minWidth: '8rem' }}  align={'center'}/>
        <Column field="toolTypeName" header="Tipo" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column field="brand" header="Marca" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column field="model" header="Modelo" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '12rem' }} />       
      </DataTable>
      <Dialog header="Header" visible={visible} onHide={() => setVisible(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <Tool tool={selectedTool} setVisible={setVisible} />
      </Dialog>
      <Dialog header="Header" visible={visibleTool} onHide={() => setVisibleTool(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <ViewTool tool={selectedTool} setVisible={setVisible} />
      </Dialog>
    </div>
  )
}

export default TableTools