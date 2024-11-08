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
import SignUp from '../../pages/Authentication/SignUp';
import { apiRequestAuth } from '../../lib/apiRequest';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import ViewUser from '../../pages/Users/ViewUser';
import { createLog, handleErrorResponse } from '../../helpers/functions';
import { useNavigate } from 'react-router-dom';

const Table = ({ data, viewActiveUsers, setViewActiveUsers, changedAUser, setChangedAUser }:any) => {
  const [customers, setCustomers] = useState(null);
  const [filters, setFilters] = useState({
    username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    fullName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    address: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    dpi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    rol: { value: null, matchMode: FilterMatchMode.EQUALS },
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [visibleUser, setVisibleUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isInactiveUser, setIsInactiveUser] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string>('');

  const toast = useRef(null);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken, updateToken } = authContext;  
  const userId = currentToken?.user?.id || 1;
  const navigate = useNavigate();

  
  useEffect(() => {
    try {
      const verificarToken = async () => {
        if( currentToken) {
          if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
          if( currentToken?.user.isUser ) navigate('/app/emergency-request');
        }
      }
      
      const transformData = async() => {
        const transformedData = data.map((customer: any) => ({
          ...customer,
          rol: roleMap[customer.roleId]
        }));
        setCustomers(transformedData);
        setLoading(false);
      }      

      verificarToken();
      transformData();
    } catch (err) {
      if(err.request.statusText === 'Unauthorized'){
        showAlert("error", "Sesion expirada", "Vuelve a iniciar sesion");
        setTimeout(() => {
          navigate('/login', { replace: true });
          updateToken('' as any);
        }, 1500);
      } else {
        showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
      }
    }    
  }, [data]);

  useEffect(() => {
    if (selectedUser && isInactiveUser) {
      confirmDialog({
        message: `${!viewActiveUsers ? '¿Desea activar este usuario?' : '¿Desea inactivar este usuario?'}`,
        header: `${!viewActiveUsers ? 'Confirma la activación' : 'Confirma la inactivación'}`,
        icon: 'pi pi-info-circle',
        acceptClassName: `${!viewActiveUsers ? 'p-button-success' : 'p-button-danger'}`,
        accept,
        reject,
        onHide: () => setIsInactiveUser(false)
      });
    }
  }, [selectedUser, isInactiveUser]);

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
                <Button label="Crear nuevo usuario" icon="pi pi-check" loading={loading} onClick={() => newUser()} className='' />
                <Button label={viewActiveUsers ? 'Ver usuarios inactivos' : 'Ver usuarios activos'} icon="pi pi-eye" loading={loading} onClick={() => viewActiveOrInactiveUsers()} className='ml-2' severity={viewActiveUsers ? 'danger' : 'success'} />                
          </IconField>
      </div>
    );
  };

  const roleMap: { [key: number]: string } = {
    1: 'Administrador',
    2: 'Bombero',
    3: 'Usuario'
  };
  
  const roleBodyTemplate = (rowData: any) => roleMap[rowData.roleId];

  const newUser = () => {
    setVisible(true);
    setSelectedUser(null);
  }

  const viewActiveOrInactiveUsers = async () => setViewActiveUsers(!viewActiveUsers);

  const editUser = (rowData:any) => {
    setVisible(true);
    setSelectedUser(rowData);
  };

  const deleteUser = async (rowData:any) => {
    setSelectedUser(rowData);
    if( !rowData.isAdmin ) {
      setIsInactiveUser(true);
    } else {
      showAlert('warn', 'Atención', 'No puedes eliminar a un administrador');
    }
  };

  const showUser = (rowData:any) => {
    setVisibleUser(true);
    setSelectedUser(rowData);
  };  

  const accept = async () => {
    if (selectedUser) {
      const formData = new FormData();
      try {
        const status = !viewActiveUsers ? 'active' : 'inactive';
        formData.append('status', status);
        formData.append('username', selectedUser.username);
        formData.append('fullName', selectedUser.fullName);
        formData.append('dpi', selectedUser.dpi);
        formData.append('phone', selectedUser.phone);
        formData.append('email', selectedUser.email);
        formData.append('address', selectedUser.address);
        formData.append('roleId', selectedUser.roleId);
        formData.append('shiftPreference', selectedUser?.shiftPreference ? selectedUser.shiftPreference : '');
  
        await apiRequestAuth.put(`/${selectedUser?.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });

        showAlert('info', 'Info', `Se ha ${status === 'active' ? 'activado' : 'desactivado'} el usuario`);      
        await createLog(userId, 'ACTUALIZAR', 'USUARIO', `Se ha ${status === 'active' ? 'activado' : 'desactivado'} el usuario: ${selectedUser?.username} con el dpi: ${selectedUser?.dpi}`, currentToken?.token);
        
        setChangedAUser(!changedAUser);
      } catch (err) {
        console.log(err);
        showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
      }
    }
  };

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });
    
  const reject = () => showAlert('warn', 'Rechazado', 'Has rechazado el proceso');

  const optionsBodyTemplate = (rowData:any) => {
    return (
      <div className="flex items-center space-x-2">
          <Button
              size='small'
              icon="pi pi-pencil"
              className="p-button-rounded p-button-success p-button-sm"
              onClick={() => editUser(rowData)}
              style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
          />
          <Button
              size='small'
              icon="pi pi-eye"
              className="p-button-rounded p-button-warning p-button-sm"
              onClick={() => showUser(rowData)}
              style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
          />
          <Button
              size='small'
              icon={viewActiveUsers ? 'pi pi-trash' : 'pi pi-check'}
              className={viewActiveUsers ? 'p-button-rounded p-button-danger p-button-sm' : 'p-button-rounded p-button-info p-button-sm'}
              onClick={() => deleteUser(rowData)}
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
        value={customers}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        loading={loading}
        globalFilterFields={['username', 'fullName', 'rol', 'address', 'dpi']}
        header={header}
        emptyMessage="Usuario no encontrado."
      >
        <Column field="username" header="Usuario"  style={{ minWidth: '8rem' }}  align={'center'}/>
        <Column field="fullName" header="Nombre" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column field="dpi" header="DPI" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column field="roleId" header="Rol" body={roleBodyTemplate} style={{ minWidth: '12rem' }} align={'center'}/>
        <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '12rem' }} />
      </DataTable>
      <Dialog header={`${selectedUser ? 'Editar usuario' : 'Crear nuevo usuario'}`} visible={visible} onHide={() => setVisible(false)}
        style={{ width: '75vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <SignUp user={selectedUser as any} setVisible={setVisible} changedAUser={changedAUser as any} setChangedAUser={setChangedAUser as any} />
      </Dialog>
      <Dialog header='Observando el usuario' visible={visibleUser} onHide={() => setVisibleUser(false)}
        style={{ width: '75vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <ViewUser user={selectedUser} token={currentToken?.token} />
      </Dialog>
    </div>
  );
};

export default Table;
