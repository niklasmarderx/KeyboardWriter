import { APIExample } from './types';

// JSON API Examples
export const API_EXAMPLES: APIExample[] = [
  {
    id: 'api-get-users',
    title: 'GET Users',
    method: 'GET',
    endpoint: '/api/v1/users?page=1&limit=10',
    difficulty: 'beginner',
  },
  {
    id: 'api-get-user',
    title: 'GET User by ID',
    method: 'GET',
    endpoint: '/api/v1/users/123',
    difficulty: 'beginner',
  },
  {
    id: 'api-post-user',
    title: 'POST Create User',
    method: 'POST',
    endpoint: '/api/v1/users',
    body: `{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "developer"
}`,
    difficulty: 'beginner',
  },
  {
    id: 'api-put-user',
    title: 'PUT Update User',
    method: 'PUT',
    endpoint: '/api/v1/users/123',
    body: `{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "role": "admin"
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'api-patch-user',
    title: 'PATCH Partial Update',
    method: 'PATCH',
    endpoint: '/api/v1/users/123',
    body: `{
  "role": "admin"
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'api-delete-user',
    title: 'DELETE User',
    method: 'DELETE',
    endpoint: '/api/v1/users/123',
    difficulty: 'beginner',
  },
  {
    id: 'api-nested',
    title: 'Nested JSON',
    method: 'POST',
    endpoint: '/api/v1/orders',
    body: `{
  "customer": {
    "id": 123,
    "name": "John Doe"
  },
  "items": [
    { "productId": 1, "quantity": 2, "price": 29.99 },
    { "productId": 2, "quantity": 1, "price": 49.99 }
  ],
  "shipping": {
    "address": "123 Main St",
    "city": "Berlin",
    "country": "Germany"
  },
  "total": 109.97
}`,
    difficulty: 'advanced',
  },
];
