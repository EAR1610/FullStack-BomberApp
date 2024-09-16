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
import { ConfirmDialog } from 'primereact/confirmdialog';
import ViewEmergency from '../../pages/Emergency/ViewEmergency';
import { AuthContextProps } from '../../interface/Auth';
import { AuthContext } from '../../context/AuthContext';

const TableEmergencies = ({ data, setViewStatusEmergency, setChangeStatusEmergency, changeStatusEmergency }:any) => {

    const [filters, setFilters] = useState({
        applicant: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        address: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');      
    const [selectedEmergency, setSelectedEmergency] = useState(null);
    const [viewEmergency, setViewEmergency] = useState(false);

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    
    const toast = useRef(null);
    
    useEffect(() => {
        setLoading(false);        
    }, []);    

    const onGlobalFilterChange = (e:any) => {
        const value = e.target.value;
        let _filters = { ...filters };
    
        _filters['global'].value = value;
    
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {

        const registeredemergency = 0;
        const inProcessEmergency = 1;
        const cancelledEmergency = 2;
        const rejectedEmergency = 3;
        const attendedEmergency = 4;

        return (
          <div className="flex justify-content-between">
              <IconField iconPosition="left">
                  <InputIcon className="pi pi-search" />
                  <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
              </IconField>
              <IconField iconPosition="left" className='ml-2'>                
                    <InputIcon className="pi pi-search" />
                    <Button label="Solicitadas" icon="pi pi-check" loading={loading} onClick={() => setViewStatusEmergency(registeredemergency)} className='' />
                    <Button label='En proceso' icon="pi pi-eye" loading={loading} onClick={() => setViewStatusEmergency(inProcessEmergency)} className='p-button-info ml-2' />
                    <Button label='Canceladas' icon="pi pi-eye" loading={loading} onClick={() => setViewStatusEmergency(cancelledEmergency)} className='p-button-warning ml-2' />
                    <Button label='Rechazadas' icon="pi pi-eye" loading={loading} onClick={() => setViewStatusEmergency(rejectedEmergency)} className='p-button-danger ml-2' />
                    <Button label='Atendidas' icon="pi pi-eye" loading={loading} onClick={() => setViewStatusEmergency(attendedEmergency)} className='p-button-success ml-2' />                    
              </IconField>
          </div>
        );
      };

      const showEmergency = (rowData:any) => {
        setSelectedEmergency(rowData);
        setViewEmergency(true);
      }      

      const optionsBodyTemplate = (rowData:any) => {
        return (
          <div className="flex items-center space-x-4">              
              <Button
                  size='small'
                  icon="pi pi-eye"
                  className="p-button-rounded p-button-warning p-button-sm"
                  onClick={() => showEmergency(rowData)}
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
        globalFilterFields={['applicant', 'address', 'description', 'status']}
        header={header}
        emptyMessage="Emergencias no encontradas."
      >
        <Column field="applicant" header="Solicitante"  style={{ minWidth: '8rem' }}  align={'center'}/>
        <Column field="address" header="Dirección" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column field="description" header="Descripción" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column field="status" header="Estado" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '12rem' }} />
      </DataTable>
      <Dialog header="Seguimiento de Emergencia" visible={viewEmergency} onHide={() => setViewEmergency(false)}
        style={{ width: '90vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <ViewEmergency emergency={selectedEmergency} setViewEmergency={ setViewEmergency } setChangeStatusEmergency={ setChangeStatusEmergency } changeStatusEmergency={ changeStatusEmergency } />
      </Dialog>
    </div>
  )
}

export default TableEmergencies