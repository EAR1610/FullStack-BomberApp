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
import VehicleType from '../../pages/VehicleType/VehicleType';
import ViewVehicleType from '../../pages/VehicleType/ViewVehicleType';
import { createLog, handleErrorResponse } from '../../helpers/functions';

const TableVehicleTypes = ({ data, viewActiveVehiclesType, setViewActiveVehiclesType, loading, isChangedVehicleType, setIsChangedVehicleType }: any) => {

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.STARTS_WITH }        
      });
      const [globalFilterValue, setGlobalFilterValue] = useState('');
      const [visible, setVisible] = useState(false);
      const [visibleVehicleType, setVisibleVehicleType] = useState(false);
      const [selectedVehicleType, setSelectedVehicleType] = useState(null);
      const [isInactiveVehicleType, setIsInactiveVehicleType] = useState(false);
    
      const toast = useRef(null); 
      
      const authContext = useContext<AuthContextProps | undefined>(AuthContext);
      if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
      const { currentToken } = authContext; 
      const userId = currentToken?.user?.id || 1;
      const [errorMessages, setErrorMessages] = useState<string>('');
      
      const onGlobalFilterChange = (e:any) => {
        const value = e.target.value;
        let _filters = { ...filters };
  
        _filters['global'].value = value;
  
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
  
    useEffect(() => {
      if( selectedVehicleType && isInactiveVehicleType ){
        confirmDialog({
          message: `${!viewActiveVehiclesType ? '¿Desea activar este registro?' : '¿Desea inactivar este registro?'}`,
          header: `${!viewActiveVehiclesType ? 'Confirma la activación' : 'Confirma la inactivación'}`,
          icon: 'pi pi-info-circle',
          acceptClassName: `${!viewActiveVehiclesType ? 'p-button-success' : 'p-button-danger'}`,
          accept,
          reject,
          onHide: () => setIsInactiveVehicleType(false)
        });
      }
    }, [selectedVehicleType, isInactiveVehicleType]);
      
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
        setIsInactiveVehicleType(true);    
      };
      
    const showVehiclesType = (vehicleType: any) => {
      setVisibleVehicleType(true);
      setSelectedVehicleType(vehicleType);
    }

    const accept = async () => {
      if (!selectedVehicleType) return;
    
      const formData = new FormData();
      const status = viewActiveVehiclesType ? 'inactive' : 'active';
      const message = status === 'active' ? 'Se ha activado el registro' : 'Se ha desactivado el registro';
    
      try {
        formData.append('name', selectedVehicleType.name);
        formData.append('status', status);
    
        await apiRequestAuth.put(`/vehicle-type/${selectedVehicleType.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        await createLog(userId, 'UPDATE', 'TIPO VEHÍCULO', `Se ha actualizado la informacion del tipo de vehículo: ${selectedVehicleType.name}`, currentToken?.token);
        setIsChangedVehicleType(!isChangedVehicleType);
        showAlert('info' , 'Info', message);
      } catch (err) {
        showAlert('warn', 'Error', handleErrorResponse(err, setErrorMessages));
      }
    };

    const reject = () => showAlert('warn', 'Rechazado', 'Has rechazado el proceso');
    const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

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
        <Column field="name" header="Nombre"  style={{ minWidth: '12rem' }}  align={'center'} />
        <Column field="status" header="Estado" style={{ minWidth: '12rem' }} align={'center'} />
        <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '12rem' }} />
      </DataTable>
      <Dialog header="Header" visible={visible} onHide={() => setVisible(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <VehicleType vehicleType={selectedVehicleType} setVisible={setVisible} isChangedVehicleType={isChangedVehicleType} setIsChangedVehicleType={setIsChangedVehicleType} />
      </Dialog>
      <Dialog header="Header" visible={visibleVehicleType} onHide={() => setVisibleVehicleType(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <ViewVehicleType vehicleType={selectedVehicleType} />
      </Dialog>
    </div>
  )
}

export default TableVehicleTypes