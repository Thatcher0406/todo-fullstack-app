from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from .models import Todo


class TodoApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='owner', password='StrongPass123', is_active=True)
        self.other_user = User.objects.create_user(username='other', password='StrongPass123', is_active=True)

        login_response = self.client.post(
            '/api/auth/login/',
            {'username': 'owner', 'password': 'StrongPass123'},
            format='json',
        )
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def test_create_and_list_todo(self):
        create_response = self.client.post(
            '/api/todos/',
            {
                'title': 'Build test',
                'description': 'Write integration tests',
                'status': 'doing',
                'priority': 'High',
            },
            format='json',
        )

        self.assertEqual(create_response.status_code, 201)
        self.assertEqual(create_response.data['status'], 'doing')

        list_response = self.client.get('/api/todos/')
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(len(list_response.data), 1)
        self.assertEqual(list_response.data[0]['title'], 'Build test')

    def test_user_cannot_access_other_users_todo(self):
        foreign_todo = Todo.objects.create(user=self.other_user, title='Other task', description='x')

        response = self.client.get(f'/api/todos/{foreign_todo.id}/')
        self.assertEqual(response.status_code, 404)
