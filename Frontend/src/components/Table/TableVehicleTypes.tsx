import { useState, useContext, useRef } from 'react';
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
import VehicleType from '../../pages/VehicleType/VehicleType';
import ViewVehicleType from '../../pages/VehicleType/ViewVehicleType';

const TableVehicleTypes = ({data, viewActiveVehiclesType, setViewActiveVehiclesType, loading}: any) => {

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.STARTS_WITH }        
      });
      const [globalFilterValue, setGlobalFilterValue] = useState('');
      const [visible, setVisible] = useState(false);
      const [visibleVehicleType, setVisibleVehicleType] = useState(false);
      const [selectedVehicleType, setSelectedVehicleType] = useState(null);
    
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
                    <Button label="Crear un nuevo registro" icon="pi pi-check" loading={loading} onClick={() => newVehicleType()} className='' />
                    <Button label={viewActiveVehiclesType ? 'Ver registros inactivos' : 'Ver registros activas'} icon="pi pi-eye" loading={loading} onClick={() => viewActiveOrInactiveVehiclesType() } className='ml-2' severity={viewActiveVehiclesType ? 'danger' : 'success'} />
                  <Dialog header="Header" visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <VehicleType vehicleType={selectedVehicleType} setVisible={setVisible} />
                </Dialog>
              </IconField>
          </div>
        );
      };


    const newVehicleType = () => {
      setVisible(true);
      setSelectedVehicleType(null);
    }

    const viewActiveOrInactiveVehiclesType = () => setViewActiveVehiclesType(!viewActiveVehiclesType);

    const editVehiclesType = (vehicleType: any) => {
      setVisible(true);
      setSelectedVehicleType(vehicleType);
    }

    const deleteVehiclesType = async (rowData:any) => {    
        setSelectedVehicleType(rowData);
          confirmDialog({
            message: `${!viewActiveVehiclesType ? '¿Desea activar este registro?' : '¿Desea inactivar este registro?'}`,
            header: `${!viewActiveVehiclesType ? 'Confirma la activación' : 'Confirma la inactivación'}`,
            icon: 'pi pi-info-circle',
            acceptClassName: `${!viewActiveVehiclesType ? 'p-button-success' : 'p-button-danger'}`,
            accept,
            reject
          });    
      };
      
    const showVehiclesType = (vehicleType: any) => {
      setVisibleVehicleType(true);
      setSelectedVehicleType(vehicleType);
    }

    const accept = async () => {
        if (selectedVehicleType) {
          const formData = new FormData();
          try {
            if(!viewActiveVehiclesType){
              formData.append('name', selectedVehicleType.name);
              formData.append('status', 'active');
              await apiRequestAuth.put(`/vehicle-type/${selectedVehicleType.id}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${currentToken?.token}`
                },
              });
              toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Se ha activado el registro', life: 3000 });
            } else {
              formData.append('name', selectedVehicleType.name);
              formData.append('status', 'inactive');
              await apiRequestAuth.put(`/vehicle-type/${selectedVehicleType.id}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${currentToken?.token}`
                },
              });
              toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Se ha desactivado el registro', life: 3000 });
            }
          } catch (error) {
            console.log(error);
          }
        }
      }; 

    const reject = () =>  toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'Has rechazado el proceso', life: 3000 });

    const optionsBodyTemplate = (rowData:any) => {
        return (
          <div className="flex items-center space-x-4">
              <Button
                  size='small'
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-success p-button-sm"
                  onClick={() => editVehiclesType(rowData)}
                  style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              />
              <Button
                  size='small'
                  icon="pi pi-eye"
                  className="p-button-rounded p-button-warning p-button-sm"
                  onClick={() => showVehiclesType(rowData)}
                  style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              />
              <Button
                  size='small'
                  icon={viewActiveVehiclesType ? 'pi pi-trash' : 'pi pi-check'}
                  className={viewActiveVehiclesType ? 'p-button-rounded p-button-danger p-button-sm' : 'p-button-rounded p-button-info p-button-sm'}
                  onClick={() => deleteVehiclesType(rowData)}
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
        <Column field="name" header="Nombre"  style={{ minWidth: '12rem' }}  />
        <Column field="status" header="Estado" style={{ minWidth: '12rem' }} />
        <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '12rem' }} />
      </DataTable>
      <Dialog header="Header" visible={visible} onHide={() => setVisible(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <VehicleType vehicleType={selectedVehicleType} setVisible={setVisible} />
      </Dialog>
      <Dialog header="Header" visible={visibleVehicleType} onHide={() => setVisibleVehicleType(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <ViewVehicleType vehicleType={selectedVehicleType} />
      </Dialog>
    </div>
  )
}

export default TableVehicleTypes