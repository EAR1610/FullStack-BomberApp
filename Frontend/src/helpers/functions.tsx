import { useState } from "react";

export const handleErrorResponse = (error: any) => {
    const [errorMessages, setErrorMessages] = useState('');
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessages = error.response.data.errors
        .map((err: { message: string }) => err.message)
        .join(', ');
        setErrorMessages(errorMessages);
    } else {
      setErrorMessages('Ocurrió un error inesperado');
    }

    return errorMessages
};