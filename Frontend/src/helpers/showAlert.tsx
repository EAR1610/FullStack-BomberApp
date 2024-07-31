const showAlert = ( type:string, message:string ) => toast.current.show({ severity: type, summary: 'Error', detail: message, life: 3000 });

export {
    showAlert
}