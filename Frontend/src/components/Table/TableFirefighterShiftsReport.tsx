import { useState, useEffect, useContext, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Toast } from 'primereact/toast';
import 'primeicons/primeicons.css';  

const TableFirefighterShiftsReport = ({ data }: any) => {

  const [filters, setFilters] = useState({
    "user.fullName": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "user.dpi": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "user.email": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    shiftPreference: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  const toast = useRef(null);

  useEffect(() => {
    setLoading(false);        
  }, []);    
  console.log(data);
  
  const onGlobalFilterChange = (e:any) => {
      const value = e.target.value;
      let _filters = { ...filters };

      _filters['global'].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
  };

  const renderHeader = () => {
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
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="card p-4 bg-gray-100 rounded-lg shadow-md">
      <Toast ref={toast} />
      
      <DataTable
       className='bg-white rounded-md overflow-hidden'
        value={data}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        loading={loading}
        header={header}
        globalFilterFields={['user.fullName', 'user.dpi', 'user.email', 'shiftPreference']}
        emptyMessage="No hay turnos asignados."
      >
        <Column field="user.fullName" header="Nombre"  style={{ minWidth: '8rem' }}  align={'center'}/>
        <Column field="user.dpi" header="DPI" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column field="user.email" header="Correo" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column field="shiftPreference" header="Turno" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column field="shiftPreference" header="Cantidad de emergenicas atendidas" style={{ minWidth: '12rem' }} align={'center'}/>
      </DataTable>
    </div>
  )
}

export default TableFirefighterShiftsReport