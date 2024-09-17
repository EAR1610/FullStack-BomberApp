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
import { EmergencyType } from '../../pages/EmergencyType/EmergencyType';
import ViewEmergencyType from '../../pages/EmergencyType/ViewEmergencyType';
import { handleErrorResponse } from '../../helpers/functions';

const TableEmergencyTypes = ({ data, viewActiveEmergenciesType, setViewActiveEmergenciesType, loading, isChangedEmergencyType, setIsChangedEmergencyType }:any) => {

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.STARTS_WITH }        
      });
      const [globalFilterValue, setGlobalFilterValue] = useState('');
      const [visible, setVisible] = useState(false);
      const [visibleEmergencyType, setVisibleEmergencyType] = useState(false);
      const [selectedEmergencyType, setSelectedEmergencyType] = useState(null);
      const [isInactiveEmergencyType, setIsInactiveEmergencyType] = useState(false);
    
      const toast = useRef(null); 
      
      const authContext = useContext<AuthContextProps | undefined>(AuthContext);
      if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
      const { currentToken } = authContext;

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
                    <Button label="Crear un nuevo registro" icon="pi pi-check" loading={loading} onClick={() => newEmergencyType()} className='' />
                    <Button label={viewActiveEmergenciesType ? 'Ver registros inactivos' : 'Ver registros activas'} icon="pi pi-eye" loading={loading} onClick={() => viewActiveOrInactiveEmergenciesType() } className='ml-2' severity={viewActiveEmergenciesType ? 'danger' : 'success'} />
                  <Dialog header="Header" visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <EmergencyType emergencyType={selectedEmergencyType} setVisible={setVisible} />
                </Dialog>
              </IconField>
          </div>
        );
      };

      useEffect(() => {
        if( selectedEmergencyType && isInactiveEmergencyType ){
          confirmDialog({
            message: `${!viewActiveEmergenciesType ? '¿Desea activar este registro?' : '¿Desea inactivar este registro?'}`,
            header: `${!viewActiveEmergenciesType ? 'Confirma la activación' : 'Confirma la inactivación'}`,
            icon: 'pi pi-info-circle',
            acceptClassName: `${!viewActiveEmergenciesType ? 'p-button-success' : 'p-button-danger'}`,
            accept,
            reject,
            onHide: () => setIsInactiveEmergencyType(false)
          });
        }
      }, [selectedEmergencyType])
      

      const newEmergencyType = () => {
        setVisible(true);
        setSelectedEmergencyType(null);
      }
  
      const viewActiveOrInactiveEmergenciesType = () => setViewActiveEmergenciesType(!viewActiveEmergenciesType);
  
      const editEmergenciesType = (emergencyType: any) => {
        setVisible(true);
        setSelectedEmergencyType(emergencyType);
      }

      const deleteEmergenciesType = async (rowData:any) => {    
        setSelectedEmergencyType(rowData);
        setIsInactiveEmergencyType(true);          
      };
      
    const showEmergenciesType = (vehicleType: any) => {
      setVisibleEmergencyType(true);
      setSelectedEmergencyType(vehicleType);
    }
    
    const accept = async () => {
      if (!selectedEmergencyType) return;
    
      const formData = new FormData();
      formData.append('name', selectedEmergencyType.name);
      const status = viewActiveEmergenciesType ? 'inactive' : 'active';
      formData.append('status', status);
    
      try {
        await apiRequestAuth.put(`/emergency-type/${selectedEmergencyType.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
    
        const message = status === 'active' ? 'Se ha activado el registro' : 'Se ha desactivado el registro';
        showAlert('info', 'Confirmado', message);
        setIsChangedEmergencyType(!isChangedEmergencyType);
      } catch (error) {
        handleErrorResponse(error);
      }
    } 

    const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

    const reject = () =>  toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'Has rechazado el proceso', life: 3000 });

    const optionsBodyTemplate = (rowData:any) => {
        return (
          <div className="flex items-center space-x-4">
              <Button
                  size='small'
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-success p-button-sm"
                  onClick={() => editEmergenciesType(rowData)}
                  style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              />
              <Button
                  size='small'
                  icon="pi pi-eye"
                  className="p-button-rounded p-button-warning p-button-sm"
                  onClick={() => showEmergenciesType(rowData)}
                  style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              />
              <Button
                  size='small'
                  icon={viewActiveEmergenciesType ? 'pi pi-trash' : 'pi pi-check'}
                  className={viewActiveEmergenciesType ? 'p-button-rounded p-button-danger p-button-sm' : 'p-button-rounded p-button-info p-button-sm'}
                  onClick={() => deleteEmergenciesType(rowData)}
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
      <Dialog header="Header" visible={visible} onHide={() => setVisible(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <EmergencyType emergencyType={selectedEmergencyType} setVisible={setVisible} isChangedEmergencyType={isChangedEmergencyType} setIsChangedEmergencyType={setIsChangedEmergencyType} />
      </Dialog>
      <Dialog header="Header" visible={visibleEmergencyType} onHide={() => setVisibleEmergencyType(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <ViewEmergencyType emergencyType={selectedEmergencyType} />
      </Dialog>
    </div>
  )
}

export default TableEmergencyTypes