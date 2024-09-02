import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({  
  'required': 'El campo {{ field }} es requerido',
  'string': 'El valor del campo {{ field }} debe de ser texto',
  'email': 'El correo electrónico no es válido',
  'minLength': 'El campo {{ field }} debe tener al menos 8 caractéres',
  'database.unique': 'El {{ field }} ya ha sido registrado',
});
