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
import FireFighter from '../../pages/FireFighters/FireFighter';
import ViewFireFighter from '../../pages/FireFighters/ViewFireFighter';
import SetFirefighterShift from '../../pages/FireFighters/SetFirefighterShift';
import { TableFirefightersProps } from '../../helpers/Interfaces';
import { createLog, handleErrorResponse } from '../../helpers/functions';
import { useNavigate } from 'react-router-dom';


const TableFirefighters: React.FC<TableFirefightersProps> = ({ data, viewActiveFirefighters, setViewActiveFirefighters, loading, isChangedFirefighter, setIsChangedFirefighter }) => {

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        shiftPreference: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        "user.userName": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        "user.dpi": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        "user.fullName": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        "user.address": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
      });
      const [globalFilterValue, setGlobalFilterValue] = useState('');
      const [visible, setVisible] = useState(false);
      const [visibleFirefighter, setVisibleFirefighter] = useState(false);
      const [visibleFirefighterShift, setvisibleFirefighterShift] = useState(false);
      const [selectedFirefighter, setSelectedFirefighter] = useState(null);
      const [isInactiveFirefighter, setIsInactiveFirefighter] = useState(false);

      const toast = useRef(null); 

      const authContext = useContext<AuthContextProps | undefined>(AuthContext);
      if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
      const { currentToken } = authContext; 
      const userId = currentToken?.user?.id || 1;
      const [errorMessages, setErrorMessages] = useState<string>('');
      const navigate = useNavigate();


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
                    <Button label={viewActiveFirefighters ? 'Ver registros inactivos' : 'Ver registros activos'} icon="pi pi-eye" loading={loading} onClick={() => viewActiveOrInactiveFirefighters() } className='ml-2' severity={viewActiveFirefighters ? 'danger' : 'success'} />                  
              </IconField>
          </div>
        );
      };

      useEffect(() => {
        const verificarToken = async () => {
          if( currentToken) {
            if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
            if( currentToken?.user.isUser ) navigate('/app/emergency-request');
          }
        }
        verificarToken();
      }, []);
      

    useEffect(() => {
      if( selectedFirefighter && isInactiveFirefighter ) {
        confirmDialog({
          message: `${!viewActiveFirefighters ? '¿Desea activar este registro?' : '¿Desea inactivar este registro?'}`,
          header: `${!viewActiveFirefighters ? 'Confirma la activación' : 'Confirma la inactivación'}`,
          icon: 'pi pi-info-circle',
          acceptClassName: `${!viewActiveFirefighters ? 'p-button-success' : 'p-button-danger'}`,
          accept,
          reject,
          onHide: () => setIsInactiveFirefighter(false)
        });
      }
    }, [selectedFirefighter, isInactiveFirefighter]);    

    const viewActiveOrInactiveFirefighters = () => setViewActiveFirefighters(!viewActiveFirefighters);

    const editFirefighters = (firefighter: any) => {
        setVisible(true);
        setSelectedFirefighter(firefighter);
    }

    const deleteFirefighters = async (rowData:any) => {
        setSelectedFirefighter(rowData);
        setIsInactiveFirefighter(true);            
    };

    const setFirefighterShift = async(firefighter: any) => {
        setvisibleFirefighterShift(true);
        setSelectedFirefighter(firefighter);
    }

    const showFirefighter = (firefighter: any) => {
        setVisibleFirefighter(true);
        setSelectedFirefighter(firefighter);
    }

    const accept = async () => {
      if (selectedFirefighter) {
        console.log(selectedFirefighter);
        const formData = new FormData();        
        formData.append('username', selectedFirefighter.user.username);
        formData.append('fullName', selectedFirefighter.user.fullName);
        formData.append('email', selectedFirefighter.user.email);
        formData.append('address', selectedFirefighter.user.address);
        formData.append('dpi', selectedFirefighter.user.dpi);
        formData.append('roleId', selectedFirefighter.user.roleId);
        formData.append('shiftPreference', selectedFirefighter.shiftPreference);

        try {
          if(!viewActiveFirefighters){
            formData.append('status', 'active');
            await apiRequestAuth.put(`/${selectedFirefighter.user.id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${currentToken?.token}`
              },
            });
            toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Se ha activado el registro', life: 3000 });
          } else {
            formData.append('status', 'inactive');
            await apiRequestAuth.put(`/${selectedFirefighter.user.id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${currentToken?.token}`
              },
            });
            toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Se ha desactivado el registro', life: 3000 });
          }
          await createLog(userId, 'ACTUALIZAR', 'BOMBERO', `Se ha ${viewActiveFirefighters ? 'activado' : 'desactivado'} el registro del bombero: ${selectedFirefighter?.user?.fullName}`, currentToken?.token);
          setIsChangedFirefighter(!isChangedFirefighter);
        } catch (error) {
          console.log(error);
          showAlert('error', 'Error', handleErrorResponse(error, setErrorMessages));
        }
      }
    }; 

    const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });  
    
    const reject = () =>  toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'Has rechazado el proceso', life: 3000 });

    const optionsBodyTemplate = (rowData:any) => {
      return (
        <div className="flex items-center space-x-4">
            <Button
                size='small'
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success p-button-sm"
                onClick={() => editFirefighters(rowData)}
                style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
            />
            <Button
                size='small'
                icon="pi pi-eye"
                className="p-button-rounded p-button-warning p-button-sm"
                onClick={() => showFirefighter(rowData)}
                style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
            />
            <Button
                size='small'
                icon={viewActiveFirefighters ? 'pi pi-trash' : 'pi pi-check'}
                className={viewActiveFirefighters ? 'p-button-rounded p-button-danger p-button-sm' : 'p-button-rounded p-button-info p-button-sm'}
                onClick={() => deleteFirefighters(rowData)}
                style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
            />
            <Button
                size='small'
                icon={'pi pi-calendar-plus'}
                className={'p-button-rounded p-button-help p-button-sm'}
                onClick={() => setFirefighterShift(rowData)}
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
      globalFilterFields={['shiftPreference', 'user.userName', 'user.fullName', 'user.email', 'user.dpi']}
      header={header}
      emptyMessage="Registro no encontrado."
    >
      <Column field="user.username" header="Usuario"  style={{ minWidth: '4rem' }}  align={'center'} />
      <Column field="user.fullName" header="Nombre Completo"  style={{ minWidth: '4rem' }}  align={'center'} />
      <Column field="user.dpi" header="DPI"  style={{ minWidth: '4rem' }}  align={'center'} />
      <Column field="user.email" header="Correo"  style={{ minWidth: '4rem' }}  align={'center'} />
      <Column field="shiftPreference" header="Turno"  style={{ minWidth: '4rem' }}  align={'center'} />
      <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '4rem' }} align={'center'} />
    </DataTable>
    <Dialog header={`${selectedFirefighter}` ? 'Actualizar Bombero' : 'Crear Bombero'} visible={visible} onHide={() => setVisible(false)}
      style={{ width: '75vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
      <FireFighter firefighter={selectedFirefighter} setVisible={setVisible} isChangedFirefighter ={isChangedFirefighter} setIsChangedFirefighter={setIsChangedFirefighter} />
    </Dialog>
    <Dialog header='Información del bombero' visible={visibleFirefighter} onHide={() => setVisibleFirefighter(false)}
      style={{ width: '75vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
      <ViewFireFighter firefighter={selectedFirefighter} />
    </Dialog>
    <Dialog header='Asignar Turno' visible={visibleFirefighterShift} onHide={() => setvisibleFirefighterShift(false)}
      style={{ width: '75vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
      <SetFirefighterShift firefighter={selectedFirefighter} setVisible={setvisibleFirefighterShift} />
    </Dialog>
  </div>
  )
}

export default TableFirefighters