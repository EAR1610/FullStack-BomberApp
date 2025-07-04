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
import { useNavigate } from 'react-router-dom';

const TableEmergencies = ({ data, setViewStatusEmergency, setChangeStatusEmergency, changeStatusEmergency }:any) => {

    const [filters, setFilters] = useState({
        applicant: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        address: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        "user.phone": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        "emergencyType.name": { value: null, matchMode: FilterMatchMode.EQUALS },
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');      
    const [selectedEmergency, setSelectedEmergency] = useState(null);
    const [viewEmergency, setViewEmergency] = useState(false);    

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;
    const userId = currentToken?.user?.id || 1;
    const navigate = useNavigate();

    const toast = useRef(null);
    
    useEffect(() => {
      const verificarToken = async () => {
        if( currentToken) {
          if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
          if( currentToken?.user.isUser ) navigate('/app/emergency-request');
        }
      }
      verificarToken();
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
          <div className="flex flex-wrap justify-between items-center space-y-2 sm:space-y-0 mb-4">
            <IconField iconPosition="left" className="flex-1 sm:max-w-xs">
                <InputIcon className="pi pi-search"/>
                <InputText
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    placeholder="Búsqueda"
                    className="w-full"
                />
            </IconField>

            <div className="flex flex-wrap justify-end gap-2">
                <Button
                    label="Solicitadas"
                    icon="pi pi-check"
                    loading={loading}
                    onClick={() => setViewStatusEmergency(registeredemergency)}
                    className="w-full sm:w-auto"
                />
                <Button
                    label="En proceso"
                    icon="pi pi-eye"
                    loading={loading}
                    onClick={() => setViewStatusEmergency(inProcessEmergency)}
                    className="p-button-info w-full sm:w-auto"
                />
                <Button
                    label="Canceladas"
                    icon="pi pi-eye"
                    loading={loading}
                    onClick={() => setViewStatusEmergency(cancelledEmergency)}
                    className="p-button-warning w-full sm:w-auto"
                />
                <Button
                    label="Rechazadas"
                    icon="pi pi-eye"
                    loading={loading}
                    onClick={() => setViewStatusEmergency(rejectedEmergency)}
                    className="p-button-danger w-full sm:w-auto"
                />
                <Button
                    label="Atendidas"
                    icon="pi pi-eye"
                    loading={loading}
                    onClick={() => setViewStatusEmergency(attendedEmergency)}
                    className="p-button-success w-full sm:w-auto"
                />
            </div>
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
        globalFilterFields={['applicant', 'user.phone', 'address', 'description', 'status', 'emergencyType.name']}
        header={header}
        emptyMessage="Emergencias no encontradas."
      >
        <Column field="applicant" header="Solicitante"  style={{ minWidth: '8rem' }}  align={'center'} />
        <Column field="user.phone" header="Teléfono"  style={{ minWidth: '8rem' }}  align={'center'} />
        <Column field="address" header="Dirección" style={{ minWidth: '12rem' }} align={'center'} />
        <Column field="description" header="Descripción" style={{ minWidth: '12rem' }} align={'center'} />
        <Column field="status" header="Estado" style={{ minWidth: '12rem' }} align={'center'} />
        <Column field="emergencyType.name" header="Tipo" style={{ minWidth: '12rem' }} align={'center'} />
        <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '12rem' }} />
      </DataTable>
      <Dialog header="Seguimiento de Emergencia" visible={viewEmergency} onHide={() => setViewEmergency(false)}
        style={{ width: '90vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} >
        <ViewEmergency emergency={selectedEmergency} setViewEmergency={ setViewEmergency } setChangeStatusEmergency={ setChangeStatusEmergency } changeStatusEmergency={ changeStatusEmergency } />
      </Dialog>
    </div>
  )
}

export default TableEmergencies