import { useState, useEffect, useContext, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import 'primeicons/primeicons.css';    

const TableEmergenciesReport = ({ data }: any) => {

    const [filters, setFilters] = useState({
        applicant: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        address: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        "emergencyType.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

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
        globalFilterFields={['applicant', 'address', 'description', 'emergencyType.name']}
        emptyMessage="Emergencias no encontradas."
      >
        <Column field="applicant" header="Solicitante"  style={{ minWidth: '8rem' }}  align={'center'}/>
        <Column field="address" header="Dirección" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column field="description" header="Descripción" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column field="emergencyType.name" header="Tipo" style={{ minWidth: '12rem' }} align={'center'}/>
      </DataTable>
    </div>
  )
}

export default TableEmergenciesReport