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
import { createLog, handleErrorResponse } from '../../helpers/functions';
import { useNavigate } from 'react-router-dom';

const TablePenalizedUsers = ({ data, changedAPenalizedUser, setChangedAPenalizedUser }:any) => {
  const [filters, setFilters] = useState({
    username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    fullName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    address: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    dpi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    rol: { value: null, matchMode: FilterMatchMode.EQUALS },
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [addOrRestPenalizationUser, setAddOrRestPenalizationUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toast = useRef(null);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;
  const userId = currentToken?.user?.id || 1;
  const [errorMessages, setErrorMessages] = useState<string>('');
  const navigate = useNavigate();


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

  useEffect(() => {
    if (selectedUser) {
      confirmDialog({
        message: `${addOrRestPenalizationUser ? '¿Desea agregar esta penalización?' : '¿Desea restar esta penalización?'}`,
        header: `${!addOrRestPenalizationUser ? 'Confirma la agregación' : 'Confirma la dismunución'}`,
        icon: 'pi pi-info-circle',
        acceptClassName: `${!addOrRestPenalizationUser ? 'p-button-success' : 'p-button-danger'}`,
        accept,
        reject,
        onHide: () => setVisible(false)
      });
    }
  }, [selectedUser, addOrRestPenalizationUser]);

  const accept = async () => {
    if (selectedUser) {
      const formData = new FormData();
      try {
        if (addOrRestPenalizationUser) {
          await apiRequestAuth.post(`/penalizations/${selectedUser?.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${currentToken?.token}`,
            },
          });
        } else {
          await apiRequestAuth.post(`/remove-penalizations/${selectedUser?.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${currentToken?.token}`,
            },
          });
        }
        showAlert('info', 'Info', `Se ha ${addOrRestPenalizationUser === true ? 'agregado' : 'restado'} la penalización al usuario`);
        
        await createLog(userId, 'ACTUALIZAR', 'USUARIO', `Se ha ${addOrRestPenalizationUser === true ? 'agregado' : 'restado'} la penalización al usuario: ${selectedUser?.username} con el dpi: ${selectedUser?.dpi}`, currentToken?.token);
        
        setChangedAPenalizedUser(!changedAPenalizedUser);
      } catch (err) {        
        showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
      }
    }
  };

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  const reject = () => showAlert('warn', 'Rechazado', 'Has rechazado el proceso');
  
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
      </div>
    );
  };

  const optionsBodyTemplate = (rowData:any) => {
    return (
      <div className="flex items-center space-x-2">
          <Button
              size='small'
              icon="pi pi-plus"
              className="p-button-rounded p-button-success p-button-sm"
              onClick={() => addPealizationUser(rowData)}
              style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
          />
          <Button
              size='small'
              icon="pi pi-minus"
              className="p-button-rounded p-button-warning p-button-sm"
              onClick={() => RestPenalizationUser(rowData)}
              style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
          />
      </div>
  )};

  const addPealizationUser = (user:any) => {
    setVisible(true);
    setAddOrRestPenalizationUser(true);
    setSelectedUser(user);
  };

  const RestPenalizationUser = (user:any) => {
    setVisible(true);
    setAddOrRestPenalizationUser(false);
    setSelectedUser(user);
  };

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
        globalFilterFields={['username', 'fullName', 'rol', 'address', 'dpi', 'phone']}
        header={header}
        emptyMessage="Usuario no encontrado."
      >
        <Column field="username" header="Usuario"  style={{ minWidth: '8rem' }}  align={'center'} />
        <Column field="fullName" header="Nombre" style={{ minWidth: '12rem' }} align={'center'} />
        <Column field="dpi" header="DPI" style={{ minWidth: '12rem' }} align={'center'} />
        <Column field="phone" header="Teléfono" style={{ minWidth: '12rem' }} align={'center'} />
        <Column field="penalizations" header="Penalizaciones" style={{ minWidth: '12rem' }} align={'center'} />
        <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '12rem' }}  />
      </DataTable>      
    </div>
  )
}

export default TablePenalizedUsers