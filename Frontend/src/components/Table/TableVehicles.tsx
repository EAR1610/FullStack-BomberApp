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
import ViewVehicle from '../../pages/Vehicles/ViewVehicle';
import Vehicle from '../../pages/Vehicles/Vehicle';
import { handleErrorResponse } from '../../helpers/functions';

const TableVehicles = ({ data, viewActiveVehicles, setViewActiveVehicles, loading, isChangedVehicle, setIsChangedVehicle }: any) => {
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        brand: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        "vehicleType.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        "originTypen.ame": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        model: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        gasolineType: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        plateNumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        vehicleNumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
      });
      const [globalFilterValue, setGlobalFilterValue] = useState('');
      const [visible, setVisible] = useState(false);
      const [visibleVehicle, setVisibleVehicle] = useState(false);
      const [selectedVehicle, setSelectedVehicle] = useState(null);
      const [isInactiveVehicle, setIsInactiveVehicle] = useState(false);
    
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

    useEffect(() => {
      if( selectedVehicle && isInactiveVehicle ) {
          confirmDialog({
              message: `${!viewActiveVehicles ? '¿Desea activar este registro?' : '¿Desea inactivar este registro?'}`,
              header: `${!viewActiveVehicles ? 'Confirma la activación' : 'Confirma la inactivación'}`,
              icon: 'pi pi-info-circle',
              acceptClassName: `${!viewActiveVehicles ? 'p-button-success' : 'p-button-danger'}`,
              accept,
              reject,
              onHide: () => setIsInactiveVehicle(false)
          });
      }
    }, [selectedVehicle])
    

    const renderHeader = () => {
      return (
        <div className="flex justify-content-between">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
            </IconField>
            <IconField iconPosition="left" className='ml-2'>                
                  <InputIcon className="pi pi-search" />
                  <Button label="Crear un nuevo registro" icon="pi pi-check" loading={loading} onClick={() => newVehicle()} className='' />
                  <Button label={viewActiveVehicles ? 'Ver registros inactivos' : 'Ver registros activas'} icon="pi pi-eye" loading={loading} onClick={() => viewActiveOrInactiveVehicles() } className='ml-2' severity={viewActiveVehicles ? 'danger' : 'success'} />
                <Dialog header="Header" visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
                  style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                  <Vehicle vehicle={selectedVehicle} setVisible={setVisible} />
              </Dialog>
            </IconField>
        </div>
      );
    };

    const newVehicle = () => {
      setVisible(true);
      setSelectedVehicle(null);
    }

    const viewActiveOrInactiveVehicles = () => setViewActiveVehicles(!viewActiveVehicles);

    const editVehicles = (vehicleType: any) => {
      setVisible(true);
      setSelectedVehicle(vehicleType);
    }

    const deleteVehicles = async (rowData:any) => {    
      setSelectedVehicle(rowData);
      setIsInactiveVehicle(true);  
    };
    
  const showVehicles = (vehicleType: any) => {
    setVisibleVehicle(true);
    setSelectedVehicle(vehicleType);
  }

  const accept = async () => {
    if (!selectedVehicle) return;
  
    const formData = new FormData();
    const vehicleData = {
      brand: selectedVehicle.brand,
      model: selectedVehicle.model,
      line: selectedVehicle.line,
      vehicleNumber: String(selectedVehicle.vehicleNumber),
      gasolineType: selectedVehicle.gasolineType,
      plateNumber: selectedVehicle.plateNumber,
      dateOfPurchase: new Date(selectedVehicle.dateOfPurchase).toISOString().split('T')[0],
      dateOfLeaving: '',
      reasonOfLeaving: String(null),
      remarks: String(null),
      vehicleTypeId: JSON.stringify(selectedVehicle.vehicleTypeId),
      originTypeId: JSON.stringify(selectedVehicle.originTypeId),
    };
  
    Object.keys(vehicleData).forEach((key) => {
      formData.append(key, vehicleData[key]);
    });
  
    try {
      const status = viewActiveVehicles ? 'inactive' : 'active';
      formData.append('status', status);
  
      await apiRequestAuth.put(`/vehicle/${selectedVehicle.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentToken?.token}`,
        },
      });
  
      const message = status === 'active' ? 'Se ha activado el registro' : 'Se ha desactivado el registro';      
      setIsChangedVehicle(!isChangedVehicle);
      showAlert('info', 'Info', `${message}`);
    } catch (error) {
      handleErrorResponse(error);
    }
  }; 

  const reject = () => showAlert('warn', 'Rechazado', `Has rechazado el proceso`);

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  const optionsBodyTemplate = (rowData:any) => {
    return (
      <div className="flex items-center space-x-4">
          <Button
              size='small'
              icon="pi pi-pencil"
              className="p-button-rounded p-button-success p-button-sm"
              onClick={() => editVehicles(rowData)}
              style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
          />
          <Button
              size='small'
              icon="pi pi-eye"
              className="p-button-rounded p-button-warning p-button-sm"
              onClick={() => showVehicles(rowData)}
              style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
          />
          <Button
              size='small'
              icon={viewActiveVehicles ? 'pi pi-trash' : 'pi pi-check'}
              className={viewActiveVehicles ? 'p-button-rounded p-button-danger p-button-sm' : 'p-button-rounded p-button-info p-button-sm'}
              onClick={() => deleteVehicles(rowData)}
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
      globalFilterFields={['brand', 'model','gasolineType', 'plateNumber', 'vehicleType.name', 'originType.name', 'vehicleNumber']}
      header={header}
      emptyMessage="Registro no encontrado."
    >
      <Column field="brand" header="Marca"  style={{ minWidth: '8rem' }}  align={'center'} />
      <Column field="vehicleType.name" header="Tipo"  style={{ minWidth: '8rem' }}  align={'center'} />
      <Column field="originType.name" header="Origen"  style={{ minWidth: '8rem' }}  align={'center'} />
      <Column field="model" header="Modelo"  style={{ minWidth: '8rem' }}  align={'center'} />
      <Column field="gasolineType" header="Gasolina"  style={{ minWidth: '8rem' }}  align={'center'} />
      <Column field="plateNumber" header="Placa"  style={{ minWidth: '8rem' }}  align={'center'} />
      <Column field="vehicleNumber" header="No. Vehículo" style={{ minWidth: '8rem' }} align={'center'} />
      <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '8rem' }} />
    </DataTable>
    <Dialog header="Header" visible={visible} onHide={() => setVisible(false)}
      style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
      <Vehicle vehicle={selectedVehicle} setVisible={setVisible} isChangedVehicle={isChangedVehicle} setIsChangedVehicle={setIsChangedVehicle} />
    </Dialog>
    <Dialog header="Header" visible={visibleVehicle} onHide={() => setVisibleVehicle(false)}
      style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
      <ViewVehicle vehicle={selectedVehicle} />
    </Dialog>
  </div>
  )
}

export default TableVehicles