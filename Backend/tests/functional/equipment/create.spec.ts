import { ApiClient } from '@japa/api-client';
import { test } from '@japa/runner'

test.group('Create an equipment', () => {
  test('create an equipment', async ({ assert }) => {
    const token = 'oat_MQ.MWJPTU5aakZ3clJodUNmMEtfcVVQUG9USmZYaWlwSk1kbjhENXJwZjE5Nzk2OTIy';
    const client = new ApiClient();

    const name = 'test equipment';
    const status = 'active';
    
    const response = await client
    .post(`${process.env.BACKEND_URL}/users/equipment-type`)
    .header('Authorization', `Bearer ${token}`)
    .form({
      name,
      status
    });
    assert.equal(response.status(), 200, 'Expected status code to be 200');
  });

  test('error on create an equipment', async ({ assert }) => {
    const token = 'oat_MQ.MWJPTU5aakZ3clJodUNmMEtfcVVQUG9USmZYaWlwSk1kbjhENXJwZjE5Nzk2OTIy';
    const client = new ApiClient();

    const name = 'test equipment';
    const status = 'actives';
    
    const response = await client
    .post(`${process.env.BACKEND_URL}/users/equipment-type`)
    .header('Authorization', `Bearer ${token}`)
    .form({
      name,
      status
    });
    assert.equal(response.status(), 422, 'Expected status code to be 402');
  })
})