import { useContext, useEffect, useRef, useState } from "react"
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Events, FirefighterShift } from "../../helpers/Interfaces";
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import { Toast } from "primereact/toast"
import 'react-big-calendar/lib/css/react-big-calendar.css'
import "dayjs/locale/es"
import dayjs from 'dayjs'
import { createLog, handleErrorResponse } from "../../helpers/functions";
import { useNavigate } from "react-router-dom";
dayjs.locale('es');

const FirefigherShiftCalendar = () => {

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const [events, setEvents] = useState<Events[]>([]);
  const { currentToken, updateToken } = authContext;
  const userId = currentToken?.user?.id || 1;
  const [errorMessages, setErrorMessages] = useState<string>('');

  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getFirefighterShifts = async () => {
      try {
        const response = await apiRequestAuth.post(`/firefighter-shift/get-shift-by-firefighter/${currentToken?.firefighter?.id}`,{}, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        })
        if (response) {
          const transformedEvents = response.data.map((shift: FirefighterShift) => ({
            id: shift.id,
            title: shift.name,
            start: dayjs(shift.shiftStart).add(6, 'hour').toDate(),
            end: dayjs(shift.shiftEnd).add(6, 'hour').toDate(),
            description: shift.description,
          }));
          setEvents(transformedEvents);
        }
        await createLog(userId, 'ACTUALIZAR', 'BOMBERO', `Se ha establecido el turno del bombero: ${currentToken?.user?.username}`, currentToken?.token);
      } catch (err) {
        if(err.response.data.errors[0].message === 'Unauthorized access'){
          showAlert("error", "Sesion expirada", "Vuelve a iniciar sesion");
          setTimeout(() => {
            navigate('/login', { replace: true });
            updateToken('' as any);
          }, 1500);
        } else {
          showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
        }
      }
    }

    getFirefighterShifts()
  }, []);

    const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });
  
    const localizer = dayjsLocalizer(dayjs)
    const 
    messages = {
      allDay: 'Todo el día',
      previous: 'Anterior',
      next: 'Siguiente',
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      agenda: 'Agenda',
      date: 'Fecha',
      time: 'Hora',
      event: 'Evento',
      noEventsInRange: 'Sin eventos',
      showMore: (total: number) => `${total} más`,
    };

  return (
    <>
      <Toast ref={toast} />
      <Calendar
          className='bg-white'
          events={events}
          localizer={localizer}
          style={{ height: 800 }}
          messages={messages}
      />
    </>
  )
}

export default FirefigherShiftCalendar