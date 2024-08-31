import { useContext, useEffect, useRef, useState } from "react";
import { apiRequestAuth } from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { AuthContextProps } from "../../interface/Auth";
import { useNavigate } from 'react-router-dom';

const MyEmergencies = () => {
  const [myEmergencies, setMyEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  useEffect(() => {
    
    if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
    if( currentToken?.user.isAdmin ) navigate('/app/dashboard');

    const getMyEmergencies = async () => {
      try {
        const response = await apiRequestAuth.post(`/emergencies/my-emergencies/${currentToken?.user.id}`, {}, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        setMyEmergencies(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getMyEmergencies();
  }, [currentToken]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === myEmergencies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? myEmergencies.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="w-full">
      <div id="animation-carousel" className="relative w-full" data-carousel="static">
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
          {myEmergencies.map((emergency, index) => (
            <div
              key={emergency.id}
              className={`absolute inset-0 transition-transform transform ${
                index === currentIndex ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
              } duration-700 ease-in-out`}
              style={{ transition: "opacity 0.5s, transform 0.5s" }}
              data-carousel-item={index === currentIndex ? "active" : ""}
            >
              <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto">
                <a href="#" onClick={() => setSelectedEmergency(emergency)}>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                    Emergencia No #: {emergency.id}
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-center">
                  Descripción: {emergency.description}
                </p>
                <div
                  className={`mb-3 p-2 rounded text-center ${
                    emergency.status === 'Registrada'
                      ? 'bg-yellow-400 dark:bg-yellow-700'
                      : emergency.status === 'En proceso'
                      ? 'bg-blue-400 dark:bg-blue-700'
                      : emergency.status === 'Cancelada'
                      ? 'bg-red-400 dark:bg-red-700'
                      : emergency.status === 'Rechazada'
                      ? 'bg-yellow-400 dark:bg-yellow-700'
                      : emergency.status === 'Atendida'
                      ? 'bg-green-400 dark:bg-green-700'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <p className="font-bold text-white dark:text-gray-200">
                    Estado: {emergency.status}
                  </p>
                </div>

                <div className="text-center">
                <a
                  href="#"
                  onClick={() => setSelectedEmergency(emergency)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Ver más detalles
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                  </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          onClick={handlePrev}
          data-carousel-prev
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              className="w-4 h-4 text-slate-800 dark:text-gray-800 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>

        <button
          type="button"
          className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          onClick={handleNext}
          data-carousel-next
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              className="w-4 h-4 text-slate-800 dark:text-gray-800 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>

      {/* Modal para la emergencia seleccionada */}
      {/* {selectedEmergency && (
        <Modal emergency={selectedEmergency} onClose={() => setSelectedEmergency(null)} />
      )} */}
    </div>
  );
};

export default MyEmergencies;
