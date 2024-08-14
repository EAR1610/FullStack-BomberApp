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
import EquipmentType from '../../pages/EquipmentType/EquipmentType';
import ViewEquipmentType from '../../pages/EquipmentType/ViewEquipmentType';

const TableEquipmentTypes = ({ data, viewActiveEquipmentsType, setViewActiveEquipmentsType, loading }: any) => {

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.STARTS_WITH }        
      });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [visibleEquipmentType, setVisibleEquipmentType] = useState(false);
    const [selectedEquipmentType, setSelectedEquipmentType] = useState(null);

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
                    <Button label="Crear un nuevo registro" icon="pi pi-check" loading={loading} onClick={() => newEquipmentType()} className='' />
                    <Button label={viewActiveEquipmentsType ? 'Ver registros inactivos' : 'Ver registros activas'} icon="pi pi-eye" loading={loading} onClick={() => viewActiveOrInactiveEquipmentType() } className='ml-2' severity={viewActiveEquipmentsType ? 'danger' : 'success'} />
                  <Dialog header="Header" visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>                  
                    {/* <OriginType originType={selectedOriginType} setVisible={setVisible}/> */}
                </Dialog>
              </IconField>
          </div>
        );
      };

    const newEquipmentType = () => {
        setVisible(true);
        setSelectedEquipmentType(null);
    }

    const viewActiveOrInactiveEquipmentType = () => {
      console.log(viewActiveEquipmentsType);
      setViewActiveEquipmentsType(!viewActiveEquipmentsType);
      console.log(viewActiveEquipmentsType);
    } 
      

    const editEquipmentType = (toolType: any) => {
        setVisible(true);
        setSelectedEquipmentType(toolType);
    }

    const deleteEquipmentType = async (rowData:any) => { 
        setSelectedEquipmentType(rowData);
          confirmDialog({
            message: `${!viewActiveEquipmentsType ? '¿Desea activar este registro?' : '¿Desea inactivar este registro?'}`,
            header: `${!setViewActiveEquipmentsType ? 'Confirma la activación' : 'Confirma la inactivación'}`,
            icon: 'pi pi-info-circle',
            acceptClassName: `${!setViewActiveEquipmentsType ? 'p-button-success' : 'p-button-danger'}`,
            accept,
            reject
          });    
      };
    
      const showEquipmentType = (rowData:any) => {
        setVisibleEquipmentType(true);
        setSelectedEquipmentType(rowData);
      }  
      
      const accept = async () => {
        if (selectedEquipmentType) {
          const formData = new FormData();
          debugger;
          try {
            if(!viewActiveEquipmentsType){
              formData.append('name', selectedEquipmentType.name);
              formData.append('status', 'active');
              await apiRequestAuth.put(`/equipment-type/${selectedEquipmentType.id}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${currentToken?.token}`
                },
              });
              toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Se ha activado el registro', life: 3000 });
            } else {
              formData.append('name', selectedEquipmentType.name);
              formData.append('status', 'inactive');
              await apiRequestAuth.put(`/equipment-type/${selectedEquipmentType.id}`, formData, {
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
      
      const reject = () => toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'Has rechazado el proceso', life: 3000 });
      
      const optionsBodyTemplate = (rowData:any) => {
        return (
          <div className="flex items-center space-x-4">
              <Button
                  size='small'
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-success p-button-sm"
                  onClick={() => editEquipmentType(rowData)}
                  style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              />
              <Button
                  size='small'
                  icon="pi pi-eye"
                  className="p-button-rounded p-button-warning p-button-sm"
                  onClick={() => showEquipmentType(rowData)}
                  style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              />
              <Button
                  size='small'
                  icon={viewActiveEquipmentsType ? 'pi pi-trash' : 'pi pi-check'}
                  className={viewActiveEquipmentsType ? 'p-button-rounded p-button-danger p-button-sm' : 'p-button-rounded p-button-info p-button-sm'}
                  onClick={() => deleteEquipmentType(rowData)}
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
        <EquipmentType equipmentType={selectedEquipmentType} setVisible={setVisible} />
      </Dialog>
      <Dialog header="Header" visible={visibleEquipmentType} onHide={() => setVisibleEquipmentType(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <ViewEquipmentType equipmentType={selectedEquipmentType} />
      </Dialog>
    </div>
  )
}

export default TableEquipmentTypes