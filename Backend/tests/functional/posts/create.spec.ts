import { ApiClient } from '@japa/api-client'
import { test } from '@japa/runner'
import path, { join } from 'path';
import { fileURLToPath } from 'url';

test.group('Login', () => {
  
  test('login user', async ({ assert }) => {
    const email = 'user@bomberapp.com';
    const password = 'user';
    
    const client = new ApiClient();
    
    const response = await client
    .post(`${process.env.BACKEND_URL}/user/login`)
    .form({
      email,
      password,
    });
    
    assert.exists(response.body().token, 'Token not found')
    assert.equal(response.body().type, 'bearer', 'The token type isnt bearer')
  });

  test('fail login', async({ assert }) => {
    const email = 'alexander@dev.com';
    const password = 'alexanderX';
    
    const client = new ApiClient();
    
    const response = await client
    .post(`${process.env.BACKEND_URL}/user/login`)
    .form({
      email,
      password,
    });
          
    assert.equal(response.status(), 400, 'Expected status code to be 400');
  });
});

test.group('Create-account', () => {
  test('register user', async ({ assert, client }) => {
    const username = 'edixon';
    const password = 'edixonX16';
    const fullName = 'Edixon Alexander Reynoso Ruano';
    const email = 'edixon@dev.com';
    const address = 'Calle 1, Casa 2, Barrio 3';
    const status = true;
    const roleId = 3;
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const response = await client
    .post(`${process.env.BACKEND_URL}/user/register`)
    .field('username', username)
    .field('password', password)
    .field('fullName', fullName)
    .field('email', email)
    .field('address', address)
    .field('status', status)
    .field('roleId', roleId)
    .file('photography', join(__dirname,'Sukuna Fired.jpg'));
    
    assert.equal(response.status(), 200, 'The account should be created correctly');
  }); 
  
  test('fail register user', async ({ assert, client }) => {
    const username = 'edixon';
    const password = 'edixonX16';
    const fullName = 'Edixon Alexander Reynoso Ruano';
    const email = 'edixon@dev.com';
    const address = 'Calle 1, Casa 2, Barrio 3';
    const status = true;
    const roleId = 3;
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const response = await client
    .post(`${process.env.BACKEND_URL}/user/register`)
    .field('username', username)
    .field('password', password)
    .field('fullName', fullName)
    .field('email', email)
    .field('address', address)
    .field('status', status)
    .field('roleId', roleId)
    .file('photography', join(__dirname,'Sukuna Fired.jpg'));

    assert.equal(response.status(), 422, 'Email should already exist');
  }); 
});

test.group('Logout', () =>{

  test('logout user', async ({ assert }) => {
    const token = 'oat_MTA.UzFUUVV4QV93ZVVqSEgyQUZDUGg2WW84dG0xZ2dkWkRlX0ZTdWVUMDIxMzE4ODY2MTY';
    const client = new ApiClient();
    
    const response = await client
    .delete(`${process.env.BACKEND_URL}/user/logout`)
    .header('Authorization', `Bearer ${token}`);
    assert.equal(response.status(), 200, 'Expected status code to be 200')
  });

  test('logout user', async ({ assert }) => {
    const token = 'oat_MzY.ZlJsdFE2ZlNKdEhHNmJod1Z1RzNxbHh2d0dZYWllRms0RkJ1MmIyRTE1MDQ5MTgwNTcX';
    const client = new ApiClient();
    
    const response = await client
    .delete(`${process.env.BACKEND_URL}/user/logout`)
    .header('Authorization', `Bearer ${token}`);
    assert.equal(response.status(), 401, 'Expected status code to be 401 Unauthorized')
  });
});