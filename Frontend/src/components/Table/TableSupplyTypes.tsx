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
import { createLog, handleErrorResponse } from '../../helpers/functions';
import SupplyType from '../../pages/SupplyType/SupplyType';
import ViewSupplyType from '../../pages/SupplyType/ViewSupplyType';

const TableSupplyTypes = ({ data, viewActiveSuppliesType, setViewActiveSuppliesType, loading, isChangedSupplyType, setIsChangedSupplyType }: any) => {

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.STARTS_WITH }        
      });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [visibleSupplyType, setVisibleSupplyType] = useState(false);
    const [selectedSupplyType, setSelectedSupplyType] = useState(null);
    const [isInactiveSupplyType, setIsInactiveSupplyType] = useState(false);

    const toast = useRef(null);  

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;
    const userId = currentToken?.user?.id || 1;
    const [errorMessages, setErrorMessages] = useState<string>('');

    const onGlobalFilterChange = (e:any) => {
        const value = e.target.value;
        let _filters = { ...filters };
  
        _filters['global'].value = value;
  
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    useEffect(() => {
        if( selectedSupplyType && isInactiveSupplyType ){
          confirmDialog({
            message: `${!viewActiveSuppliesType ? '¿Desea activar este registro?' : '¿Desea inactivar este registro?'}`,
            header: `${!setViewActiveSuppliesType ? 'Confirma la activación' : 'Confirma la inactivación'}`,
            icon: 'pi pi-info-circle',
            acceptClassName: `${!setViewActiveSuppliesType ? 'p-button-success' : 'p-button-danger'}`,
            accept,
            reject,
            onHide: () => setIsInactiveSupplyType(false),
          });
        }
      }, [selectedSupplyType])

      const renderHeader = () => {
        return (
          <div className="flex justify-content-between">
              <IconField iconPosition="left">
                  <InputIcon className="pi pi-search" />
                  <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
              </IconField>
              <IconField iconPosition="left" className='ml-2'>                
                    <InputIcon className="pi pi-search" />
                    <Button label="Crear un nuevo registro" icon="pi pi-check" loading={loading} onClick={() => newSupplyType()} className='' />
                    <Button label={viewActiveSuppliesType ? 'Ver registros inactivos' : 'Ver registros activas'} icon="pi pi-eye" loading={loading} onClick={() => viewActiveOrInactiveSupplyType() } className='ml-2' severity={viewActiveSuppliesType ? 'danger' : 'success'} />
                  <Dialog header="Header" visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}> 
                </Dialog>
              </IconField>
          </div>
        );
      };

      const newSupplyType = () => {
        setVisible(true);
        setSelectedSupplyType(null);
      }

      const viewActiveOrInactiveSupplyType = () => {
        setViewActiveSuppliesType(!viewActiveSuppliesType);
      }

      const editSupplyType = (toolType: any) => {
        setVisible(true);
        setSelectedSupplyType(toolType);
      }

      const deleteSupplyType = async (rowData:any) => { 
        setSelectedSupplyType(rowData);
        setIsInactiveSupplyType(true);              
      };

      const showSupplyType = (rowData:any) => {
        setVisibleSupplyType(true);
        setSelectedSupplyType(rowData);
      }  

      const accept = async () => {
        if (selectedSupplyType) {
          const formData = new FormData();
          const status = !viewActiveSuppliesType ? 'active' : 'inactive';
          const message = !viewActiveSuppliesType ? 'Se ha activado el registro' : 'Se ha desactivado el registro';
      
          try {
            formData.append('name', selectedSupplyType.name);
            formData.append('description', selectedSupplyType.description);
            formData.append('status', status);
      
            await apiRequestAuth.put(`/supply-type/${selectedSupplyType.id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${currentToken?.token}`,
              },
            });
            await createLog(userId, 'UPDATE', 'TIPO DE INSUMO', `Se ha ${status === 'active' ? 'activado' : 'desactivado'} el registro del tipo de insumo: ${selectedSupplyType?.name}`, currentToken?.token);
            
            setIsChangedSupplyType(!isChangedSupplyType);
            showAlert('info', 'Info', message);
          } catch (err) {
            showAlert('warn', 'Error', handleErrorResponse(err, setErrorMessages));
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
                  onClick={() => editSupplyType(rowData)}
                  style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              />
              <Button
                  size='small'
                  icon="pi pi-eye"
                  className="p-button-rounded p-button-warning p-button-sm"
                  onClick={() => showSupplyType(rowData)}
                  style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              />
              <Button
                  size='small'
                  icon={viewActiveSuppliesType ? 'pi pi-trash' : 'pi pi-check'}
                  className={viewActiveSuppliesType ? 'p-button-rounded p-button-danger p-button-sm' : 'p-button-rounded p-button-info p-button-sm'}
                  onClick={() => deleteSupplyType(rowData)}
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
        globalFilterFields={['name', 'status']}
        header={header}
        emptyMessage="Registro no encontrado."
      >
        <Column field="name" header="Nombre"  style={{ minWidth: '12rem' }}  align={'center'}/>
        <Column field="description" header="Descripción"  style={{ minWidth: '12rem' }}  align={'center'}/>
        <Column field="status" header="Estado" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '12rem' }} />       
      </DataTable>
      <Dialog header="Gestión del Tipo de Insumo" visible={visible} onHide={() => setVisible(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <SupplyType 
          supplyType={selectedSupplyType}
          setVisible={setVisible} 
          isChangedSupplyType={isChangedSupplyType} 
          setIsChangedSupplyType={setIsChangedSupplyType}
        />
      </Dialog>
      <Dialog header="Información del Tipo de Insumo" visible={visibleSupplyType} onHide={() => setVisibleSupplyType(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <ViewSupplyType supplyType={selectedSupplyType} />
      </Dialog>
    </div>
  )
}

export default TableSupplyTypes