import { useContext, useEffect, useRef, useState } from "react"
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { Dropdown } from "primereact/dropdown"

const Vehicle = ({ vehicle, setVisible, isChangedVehicle, setIsChangedVehicle }:any) => {

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [line, setLine] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState(0);
  const [gasolineType, setGasolineType] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [dateOfPurchase, setDateOfPurchase] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [selectedOriginType, setselectedOriginType] = useState(null);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [originTypes, setOriginTypes] = useState([]);
  const [status, setStatus] = useState('active')
  const [error, setError] = useState("");

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const toast = useRef(null);

  useEffect(() => {
    const getVehicleType = async () => {
      try {
        const response = await apiRequestAuth.get("/vehicle-type", {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        if (response) setVehicleTypes(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    const getOriginType = async () => {
      try {
        const response = await apiRequestAuth.get("/origin-type", {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        if (response) setOriginTypes(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    getVehicleType();
    getOriginType();
  }, []);
  

  useEffect(() => {

    const getVehicle = async () => {
      const formattedDate = getFormattedDate();
        setDateOfPurchase(formattedDate);
      if( vehicle ) {
        setBrand(vehicle.brand)
        setModel(vehicle.model)
        setLine(vehicle.line)
        setVehicleNumber(vehicle.vehicleNumber)
        setGasolineType(vehicle.gasolineType)
        setPlateNumber(vehicle.plateNumber)
        setDateOfPurchase(vehicle.dateOfPurchase)
        setStatus(vehicle.status)
        setSelectedVehicleType(() => {
          const vehicleType = vehicleTypes.find((type) => type.id === vehicle.vehicleTypeId);
          return vehicleType;
        })
        setselectedOriginType(() => {
          const originType = originTypes.find((type) => type.id === vehicle.originTypeId);
          return originType;
        })
      }      
    }

    if( vehicleTypes.length > 0 && originTypes.length > 0 ) {
      getVehicle();      
    }
  }, [vehicleTypes]);

  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async ( e:React.FormEvent<HTMLFormElement>  ) => {
    e.preventDefault();
    setError("");
    const formData = new FormData();

    if( 
      !brand || !model || !line || vehicleNumber === 0 || !gasolineType || !plateNumber 
      || !dateOfPurchase || selectedVehicleType === null || selectedOriginType === null
    ) {
      setError("Todos los campos son obligatorios");
      return;
    } else {
      formData.append('brand', brand);
      formData.append('model', model);
      formData.append('line', line);
      formData.append('vehicleNumber', String(vehicleNumber));
      formData.append('gasolineType', gasolineType);
      formData.append('plateNumber', plateNumber);
      formData.append('dateOfPurchase', new Date(dateOfPurchase).toISOString().split('T')[0]);
      formData.append('dateOfLeaving', '');
      formData.append('reasonOfLeaving', String(null));
      formData.append('remarks', String(null));
      formData.append('vehicleTypeId', JSON.stringify(selectedVehicleType?.id));
      formData.append('originTypeId', JSON.stringify(selectedOriginType?.id));
      formData.append('status', status);
    }

    try {
      if ( vehicle ) {
        await apiRequestAuth.put(`/vehicle/${vehicle.id}`, formData, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        showAlert('info', 'Info', 'Registro actualizado!');
      } else {
        await apiRequestAuth.post(`/vehicle`, formData, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        showAlert('info', 'Info', 'Registro creado!');
      }
      setIsChangedVehicle(!isChangedVehicle);
      setTimeout(() => {
        setVisible(false);        
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });  

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
    <Toast ref={toast} />
      <div className="flex flex-wrap items-center">            
        <div className={`${currentToken ? 'w-full' : 'border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'}`}>
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
              Crea el registro de unidades de emergencia en <span className='text-red-500'>BomberApp</span>
            </h2>
            <form onSubmit={ handleSubmit }>
              <div className="mb-4">
                <label htmlFor='brand' className="mb-2.5 block font-medium text-black dark:text-white">
                  Marca
                </label>
                <div className="relative">
                  <input
                    id='brand'
                    type="text"
                    placeholder="Ingresa la marca de la unidad"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ brand }
                    onChange={ e => setBrand( e.target.value ) }
                  />
                </div>
              </div>   

              <div className="mb-4">
                <label htmlFor='model' className="mb-2.5 block font-medium text-black dark:text-white">
                  Modelo
                </label>
                <div className="relative">
                  <input
                    id='model'
                    type="text"
                    placeholder="Ingresa el modelo de la unidad"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ model }
                    onChange={ e => setModel( e.target.value ) }
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor='line' className="mb-2.5 block font-medium text-black dark:text-white">
                  Línea
                </label>
                <div className="relative">
                  <input
                    id='line'
                    type="text"
                    placeholder="Ingresa la línea de la unidad"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ line }
                    onChange={ e => setLine( e.target.value ) }
                  />
                </div>
              </div>          

              <div className="mb-4">
                <label htmlFor='gasoline_type' className="mb-2.5 block font-medium text-black dark:text-white">
                  Gasolina
                </label>
                <div className="relative">
                  <input
                    id='gasoline_type'
                    type="text"
                    placeholder="Ingresa el tipo de gasolina de la unidad"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ gasolineType }
                    onChange={ e => setGasolineType( e.target.value ) }
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor='vehicle_number' className="mb-2.5 block font-medium text-black dark:text-white">
                  No. Vehículo
                </label>
                <div className="relative">
                  <input
                    id='vehicle_number'
                    type="number"
                    min={0}
                    placeholder="Ingresa el número de vehículo de la unidad"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ vehicleNumber }
                    onChange={ e => setVehicleNumber( parseInt(e.target.value )) }
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor='plate_number' className="mb-2.5 block font-medium text-black dark:text-white">
                  Número de placa
                </label>
                <div className="relative">
                  <input
                    id='plate_number'
                    type="text"
                    placeholder="Ingresa el número de placa de la unidad"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ plateNumber }
                    onChange={ e => setPlateNumber( e.target.value ) }
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Tipo de unidad
                </label>
                <div className="relative">
                <Dropdown
                  value={selectedVehicleType}
                  options={vehicleTypes}
                  onChange={(e) => setSelectedVehicleType(e.value)}
                  optionLabel="name"  
                  optionValue="id"
                  placeholder="Seleccione un tipo de unidad"
                  className="w-full"
                />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Tipo de origen
                </label>
                <div className="relative">
                <Dropdown
                  value={selectedOriginType}
                  options={originTypes}
                  onChange={(e) => setselectedOriginType(e.value)}
                  optionLabel="name"  
                  optionValue="id"
                  placeholder="Seleccione el tipo de origen"
                  className="w-full"
                />
                </div>
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value={`${ vehicle ? 'Actualizar registro' : 'Crear registro'}`}
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>
              { error && <span>{ error }</span> }
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Vehicle