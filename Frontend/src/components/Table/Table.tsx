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

const Table = ({ data, setUsers }:any) => {
  const [customers, setCustomers] = useState(null);
  const [filters, setFilters] = useState({
    username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    fullName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    address: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    rol: { value: null, matchMode: FilterMatchMode.EQUALS },
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toast = useRef(null);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;  
  
  useEffect(() => {
    setCustomers(data);
    setLoading(false);
  }, [data]);

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
                <Button label="Usuarios Inactivos" icon="pi pi-eye" loading={loading} onClick={() => viewInactiveUsers()} className='ml-2' severity="danger" />
              <Dialog header="Header" visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>                  
                <SignUp user={selectedUser} setVisible={setVisible}/>
            </Dialog>
          </IconField>
      </div>
    );
  };

  const newUser = () => {
    setSelectedUser(null);
    setVisible(true);
  }

  const viewInactiveUsers = async () =>{
    try {
      const users = await apiRequestAuth.post("/inactive-users",{},{
        headers: {
          Authorization: `Bearer ${currentToken?.token}`
        }
      });
      setUsers(users.data);
    } catch (error) {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Ha ocurrido un error al obtener los usuarios' });
    }
  }

  const editUser = (rowData:any) => {
    setSelectedUser(rowData);
    setVisible(true);
  };

  const deleteUser = async (rowData:any) => {    
    setSelectedUser(rowData);
      confirmDialog({
        message: '¿Desea Inactivar este usuario?',
        header: 'Confirma la Inactivación',
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        accept,
        reject
      });    
  };

  const accept = async () => {
    if (selectedUser) {
      const formData = new FormData();
      formData.append('status', 'inactive');
      try {
        await apiRequestAuth.put(`/${selectedUser.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentToken?.token}`
          },
        });
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Se ha desactivado el usuario', life: 3000 });
      } catch (error) {
        console.log(error)
      }
    }
  };

  const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'Has rechazado el proceso', life: 3000 });
  };

  const optionsBodyTemplate = (rowData:any) => {
    return (
      <div className="flex items-center space-x-4">
          <Button
              size='small'
              icon="pi pi-pencil"
              className="p-button-rounded p-button-success p-button-sm"
              onClick={() => editUser(rowData)}
              style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
          />
          <Button
              size='small'
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger p-button-sm"
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
        globalFilterFields={['username', 'fullName', 'email', 'address']}
        header={header}
        emptyMessage="Usuario no encontrado."
      >
        <Column field="username" header="Usuario"  style={{ minWidth: '8rem' }}  />
        <Column field="fullName" header="Nombre" style={{ minWidth: '12rem' }} />
        <Column field="email" header="Correo" style={{ minWidth: '12rem' }} />
        <Column field="address" header="Dirección" style={{ minWidth: '12rem' }} />
        <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '12rem' }} />       
      </DataTable>
      <Dialog header="Header" visible={visible} onHide={() => setVisible(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <SignUp user={selectedUser} setVisible={setVisible} />
      </Dialog>
    </div>
  );
};

export default Table;
