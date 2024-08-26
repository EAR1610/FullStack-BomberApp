import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({  
  'required': 'El campo {{ field }} es requerido',
  'string': 'El valor del campo {{ field }} debe de ser texto',
  'email': 'El correo electrónico no es válido',
});
