import { apiRequestAuth } from "../lib/apiRequest";

export const handleErrorResponse = (error: any, setErrorMessages: (msg: string) => void) => {
  const errorMessages = error?.response?.data?.errors
    ? error.response.data.errors.map((err: { message: string }) => err.message).join(', ')
    : 'Ocurrió un error inesperado';

  setErrorMessages(errorMessages);

  return errorMessages;
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleString('es-ES', {
    timeZone: 'America/Guatemala',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const [datePart, timePart] = formattedDate.split(', ');
  const [day, month, year] = datePart.split('/');

  return `${day}/${month}/${year} ${timePart}`;
};

export const createLog = async (
  userId: number, 
  actionType: string, 
  entityType: string, 
  description: string, 
  currentToken: string | undefined 
) => {
  try {
    const formDataLog = new FormData();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-CA', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false,
      timeZone: 'America/Guatemala'
    }).replace(',', '');

    formDataLog.append('userId', String(userId));
    formDataLog.append('actionType', actionType);
    formDataLog.append('entityType', entityType);
    formDataLog.append('description', description);
    formDataLog.append("date", formattedDate);

    await apiRequestAuth.post("/logs", formDataLog, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${currentToken}`
      }
    });
  } catch (error) {
    console.log(error);
  }
};