import { useState, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import SignUp from '../../pages/Authentication/SignUp';

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
  const [statuses] = useState(['Activo', 'Inactivo']);
  const [roles] = useState(['Administrador', 'Usuario', 'Bombero']);
  const [selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    setCustomers(data);
    setLoading(false);
  }, [data]);

  const getSeverity = (status:any) => {
    switch (status) {
      case 'Inactivo':
        return 'danger';
      case 'Activo':
        return 'success';
      default:
        return null;
    }
  };

  const getRol = (rol:any) => {
    switch (rol) {
      case 'Administrador':
        return 'success';
      case 'Usuario':
        return 'info';
      case 'Bombero':
        return 'warning';
      default:
        return null;
    }
  };

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
              <Button label="Crear nuevo usuario" icon="pi pi-check" loading={loading} onClick={() => setVisible(true)} className='' />
              <Dialog header="Header" visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <SignUp />
            </Dialog>
          </IconField>
      </div>
    );
  };

  const statusBodyTemplate = (rowData:any) => {
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
  };
  
  const statusItemTemplate = (option:any) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };
  
  const rolesBodyTemplate = (rowData:any) => {
    return <Tag value={rowData.rol} severity={ getRol(rowData.rol)} />;
  };

  const rolesItemTemplate = (option:any) => {
    return <Tag value={option} severity={getRol(option)} />;
  };

  const editUser = (rowData:any) => {
    setSelectedUser(rowData);
    setVisible(true);
  };

const deleteUser = (rowData:any) => {
  };

  const optionsBodyTemplate = (rowData:any) => {
    return (
        <div className="flex space-x-2">
            <Button label="Editar" icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editUser(rowData)} />
            <Button label="Eliminar" icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteUser(rowData)} />
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
        globalFilterFields={['username', 'fullName', 'email', 'address', 'status', 'rol']}
        header={header}
        emptyMessage="Usuario no encontrado."
      >
        <Column field="username" header="Usuario" filter filterPlaceholder="Busqueda por usuario" style={{ minWidth: '12rem' }}  />
        <Column field="fullName" header="Nombre" filter filterPlaceholder="Busqueda por nombre" style={{ minWidth: '12rem' }} />
        <Column field="email" header="Correo" filter filterPlaceholder="Busqueda por correo" style={{ minWidth: '12rem' }} />
        <Column field="address" header="Dirección" filter filterPlaceholder="Busqueda por direccion" style={{ minWidth: '12rem' }} />
        <Column field="address" header="Dirección" filter filterPlaceholder="Busqueda por direccion" style={{ minWidth: '12rem' }} />
        <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '12rem' }} />
        <Column field="rol" header="Rol" filter filterElement={(options) => (
          <Dropdown
            value={options.value}
            options={roles}
            onChange={(e) => options.filterApplyCallback(e.value)}
            itemTemplate={rolesItemTemplate}
            placeholder="Rol"
            showClear
            style={{ minWidth: '5rem' }}
          />
        )} body={rolesBodyTemplate} style={{ minWidth: '5rem' }}/>
      </DataTable>
      <Dialog header="Header" visible={visible} onHide={() => setVisible(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <SignUp data={selectedUser} />
      </Dialog>
    </div>
  );
};

export default Table;
