import { Toast } from "primereact/toast";
import { useRef } from "react";

export const useToast = () => {
  const toast = useRef<Toast>(null);

  const showAlert = (severity: string, summary: string, detail: string) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const ToastComponent = () => <Toast ref={toast} />;

  return { showAlert, ToastComponent };
};
