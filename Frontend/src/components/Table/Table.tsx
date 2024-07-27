import { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
// import '../../index.css'

const Table = ({ data }) => {
  const [customers, setCustomers] = useState(null);
  const [filters, setFilters] = useState({
    username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    fullName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    address: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const [statuses] = useState(['Activo', 'Inactivo']);

  const getSeverity = (status) => {
    switch (status) {
      case 'Inactivo':
        return 'danger';
      case 'Activo':
        return 'success';
      default:
        return null;
    }
  };

  useEffect(() => {
    setCustomers(data);
    setLoading(false);
  }, [data]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda"/>
        </span>
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
  };

  const statusItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };

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
        globalFilterFields={['username', 'fullName', 'email', 'address', 'status']}
        header={header}
        emptyMessage="Usuario no encontrado."
      >
        <Column field="username" header="Usuario" filter filterPlaceholder="Busqueda por usuario" style={{ minWidth: '12rem' }}  />
        <Column field="fullName" header="Nombre" filter filterPlaceholder="Busqueda por nombre" style={{ minWidth: '12rem' }} />
        <Column field="email" header="Correo" filter filterPlaceholder="Busqueda por correo" style={{ minWidth: '12rem' }} />
        <Column field="address" header="Dirección" filter filterPlaceholder="Busqueda por direccion" style={{ minWidth: '12rem' }} />
        <Column field="status" header="Estado" filter filterElement={(options) => (
          <Dropdown
            value={options.value}
            options={statuses}
            onChange={(e) => options.filterApplyCallback(e.value)}
            itemTemplate={statusItemTemplate}
            placeholder="Seleccciona un estado"
            showClear
            style={{ minWidth: '12rem' }}
          />
        )} body={statusBodyTemplate} style={{ minWidth: '12rem' }}/>
      </DataTable>
    </div>
  );
};

export default Table;
