import { useState, useContext, useRef, useEffect } from 'react';
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
import { handleErrorResponse } from '../../helpers/functions';
import Supply from '../../pages/Supply/Supply';
import ViewSupply from '../../pages/Supply/ViewSupply';

const TableSupply = ({ data, viewActiveSupplies, setViewActiveSupplies, loading, isChangedSupply, setIsChangedSupply }: any) => {
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        "supplyType.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.STARTS_WITH }        
      });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [visibleSupply, setVisibleSupply] = useState(false);
    const [selectedSupply, setSelectedSupply] = useState(null);
    const [isInactiveSupply, setIsInactiveSupply] = useState(false);

    const toast = useRef(null);  

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;

    const onGlobalFilterChange = (e:any) => {
        const value = e.target.value;
        let _filters = { ...filters };
  
        _filters['global'].value = value;
  
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    useEffect(() => {
        if( selectedSupply && isInactiveSupply ){
          confirmDialog({
            message: `${!viewActiveSupplies ? '¿Desea activar este registro?' : '¿Desea inactivar este registro?'}`,
            header: `${!setViewActiveSupplies ? 'Confirma la activación' : 'Confirma la inactivación'}`,
            icon: 'pi pi-info-circle',
            acceptClassName: `${!setViewActiveSupplies ? 'p-button-success' : 'p-button-danger'}`,
            accept,
            reject,
            onHide: () => setIsInactiveSupply(false),
          });
        }
      }, [selectedSupply]);

      const renderHeader = () => {
        return (
          <div className="flex justify-content-between">
              <IconField iconPosition="left">
                  <InputIcon className="pi pi-search" />
                  <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
              </IconField>
              <IconField iconPosition="left" className='ml-2'>                
                    <InputIcon className="pi pi-search" />
                    <Button label="Crear un nuevo registro" icon="pi pi-check" loading={loading} onClick={() => newSupply()} className='' />
                    <Button label={viewActiveSupplies ? 'Ver registros inactivos' : 'Ver registros activas'} icon="pi pi-eye" loading={loading} onClick={() => viewActiveOrInactiveSupply() } className='ml-2' severity={viewActiveSupplies ? 'danger' : 'success'} />
                  <Dialog header="Header" visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}> 
                </Dialog>
              </IconField>
          </div>
        );
      };

      const newSupply = () => {
        setVisible(true);
        setSelectedSupply(null);
      }

      const viewActiveOrInactiveSupply = () => {
        setViewActiveSupplies(!viewActiveSupplies);
      }

      const editSupply = (toolType: any) => {
        setVisible(true);
        setSelectedSupply(toolType);
      }

      const deleteSupply = async (rowData:any) => { 
        setSelectedSupply(rowData);
        setIsInactiveSupply(true);
      };

      const showSupply = (rowData:any) => {
        setVisibleSupply(true);
        setSelectedSupply(rowData);
      }  

      const accept = async () => {
        if (selectedSupply) {
          const formData = new FormData();
          const status = !viewActiveSupplies ? 'active' : 'inactive';
          const message = !viewActiveSupplies ? 'Se ha activado el registro' : 'Se ha desactivado el registro';
      
          try {
            formData.append('name', selectedSupply.name);
            formData.append('supplyTypeId', JSON.stringify(selectedSupply.supplyTypeId));
            formData.append('status', status);
      
            await apiRequestAuth.put(`/supply/${selectedSupply.id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${currentToken?.token}`,
              },
            });      
            setIsChangedSupply(!isChangedSupply);
            showAlert('info', 'Info', message);
          } catch (error) {
            showAlert('warn', 'Error', handleErrorResponse(error));
          }
        }
      }
      
    const reject = () => showAlert('warn', 'Rechazado', 'Has rechazado el proceso');

    const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

    const optionsBodyTemplate = (rowData:any) => {
        return (
          <div className="flex items-center space-x-4">
              <Button
                  size='small'
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-success p-button-sm"
                  onClick={() => editSupply(rowData)}
                  style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              />
              <Button
                  size='small'
                  icon="pi pi-eye"
                  className="p-button-rounded p-button-warning p-button-sm"
                  onClick={() => showSupply(rowData)}
                  style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              />
              <Button
                  size='small'
                  icon={viewActiveSupplies ? 'pi pi-trash' : 'pi pi-check'}
                  className={viewActiveSupplies ? 'p-button-rounded p-button-danger p-button-sm' : 'p-button-rounded p-button-info p-button-sm'}
                  onClick={() => deleteSupply(rowData)}
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
        globalFilterFields={['name', 'supplyType.name', 'status']}
        header={header}
        emptyMessage="Registro no encontrado."
      >
        <Column field="name" header="Nombre"  style={{ minWidth: '12rem' }}  align={'center'}/>        
        <Column field="supplyType.name" header="Tipo de insumo"  style={{ minWidth: '12rem' }}  align={'center'}/> 
        <Column field="status" header="Estado" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '12rem' }} />       
      </DataTable>
      <Dialog header="Gestión del Insumos" visible={visible} onHide={() => setVisible(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <Supply
          supply={selectedSupply}
          setVisible={setVisible} 
          isChangedSupply={isChangedSupply} 
          setIsChangedSupply={setIsChangedSupply}
        />
      </Dialog>
      <Dialog header="Información del Insumo" visible={visibleSupply} onHide={() => setVisibleSupply(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <ViewSupply supply={selectedSupply} />
      </Dialog>
    </div>
  )
}

export default TableSupply