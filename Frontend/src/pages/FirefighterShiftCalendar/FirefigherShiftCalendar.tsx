import { useContext, useEffect, useRef, useState } from "react"
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import "dayjs/locale/es"
import dayjs from 'dayjs'
dayjs.locale('es');

export interface FirefighterShift {
  id: number;
  firefighterId: number;
  name: string;
  description: string;
  shiftStart: string;
  shiftEnd: string;
  status: 'active' | 'inactive'; // Si status puede tener más valores, añade los correspondientes.
  createdAt: string;
  updatedAt: string;
}
export interface Events {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;  
}

const FirefigherShiftCalendar = () => {

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const [events, setEvents] = useState<Events[]>([]);
  const [firefightherShift, setFirefightherShift] = useState<FirefighterShift[]>([]);
  const { currentToken } = authContext;

  useEffect(() => {
    const getFirefighterShifts = async () => {
      try {
        const response = await apiRequestAuth.post(`/firefighter-shift/get-shift-by-firefighter/1`,{}, {
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
      } catch (error) {
        console.log(error);
      }
    }

    getFirefighterShifts()
  }, [])
  
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
    <Calendar
        className='bg-white'
        events={events}
        localizer={localizer}
        style={{ height: 800 }}
        messages={messages}
    />
  )
}

export default FirefigherShiftCalendar