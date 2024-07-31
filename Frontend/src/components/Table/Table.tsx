import { useState, useEffect, useContext } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import 'primeicons/primeicons.css';      
import { AuthContextProps } from '../../interface/Auth';
import { AuthContext } from '../../context/AuthContext';
import SignUp from '../../pages/Authentication/SignUp';
import { apiRequestAuth } from '../../lib/apiRequest';

const Table = ({ data }:any) => {
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

  const editUser = (rowData:any) => {
    setSelectedUser(rowData);
    setVisible(true);
  };

  const deleteUser = async (rowData:any) => {
    const formData = new FormData();
    formData.append('status', 'inactive');
    try {
      await apiRequestAuth.put(`/${rowData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentToken?.token}`
        },
      });
    } catch (error) {
      
    }
  };

  const optionsBodyTemplate = (rowData:any) => {
    return (
      <div className="flex items-center space-x-4">
          <Button
              size='small'
              label="Editar"
              icon="pi pi-pencil"
              className="p-button-rounded p-button-success p-button-sm"
              onClick={() => editUser(rowData)}
              style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
          />
          <Button
              size='small'
              label="Eliminar"
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
        <Column field="username" header="Usuario"  style={{ minWidth: '12rem' }}  />
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
