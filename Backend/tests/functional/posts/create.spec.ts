import { ApiClient } from '@japa/api-client'
import { test } from '@japa/runner'
import path, { join } from 'path';
import {fileURLToPath} from 'url';

test.group('Auth', () => {
  test('login user', async ({ assert }) => {
    const email = 'alexander@dev.com' 
    const password = 'alexander'

    const client = new ApiClient()

    const response = await client
      .post('http://localhost:3333/user/login')
      .form({
        email,
        password,
      })

    assert.exists(response.body().token, 'Token no encontrado')
    assert.equal(response.body().type, 'bearer', 'El tipo de token no es bearer')
  });

  test('register user', async ({ client }) => {
    const username = 'edixon';
    const password = 'edixonX16';
    const fullName = 'Edixon Alexander Reynoso Ruano';
    const email = 'edixon@dev.com';
    const address = 'Calle 1, Casa 2, Barrio 3';
    const status = true;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const response = await client
    .post('http://localhost:3333/user/register')
    .field('username', username)
    .field('password', password)
    .field('fullName', fullName)
    .field('email', email)
    .field('address', address)
    .field('status', status)
    .file('photography', join(__dirname,'Sukuna Fired.jpg'));

    response.assertStatus(200);
  });

  test('logout user', async ({ assert }) => {
    const token = 'oat_MjI.ekk1eXhxTW9CbXpmbUpDVTFXZlI5d1dQMTZ5UmdDVUFxRFZEblR4eTM1MzQ0NjMyMjA';
    const client = new ApiClient();

    const response = await client
      .delete('http://localhost:3333/user/logout')
      .header('Authorization', `Bearer ${token}`);
    assert.equal(response.status(), 200, 'Expected status code to be 200')
  });
})