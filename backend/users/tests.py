from django.contrib.auth.models import User
from rest_framework.test import APITestCase


class UserAuthFlowTests(APITestCase):
    def test_signup_creates_active_user(self):
        response = self.client.post(
            '/api/auth/signup/',
            {
                'username': 'newuser',
                'first_name': 'New',
                'last_name': 'User',
                'email': 'new@example.com',
                'password': 'StrongPass123',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 201)
        user = User.objects.get(username='newuser')
        self.assertTrue(user.is_active)

    def test_me_and_change_password(self):
        user = User.objects.create_user(
            username='activeuser',
            password='StrongPass123',
            email='active@example.com',
            first_name='Active',
            last_name='User',
            is_active=True,
        )

        login_response = self.client.post(
            '/api/auth/login/',
            {'username': 'activeuser', 'password': 'StrongPass123'},
            format='json',
        )
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        me_response = self.client.get('/api/auth/me/')
        self.assertEqual(me_response.status_code, 200)
        self.assertEqual(me_response.data['username'], 'activeuser')

        change_response = self.client.post(
            '/api/auth/change-password/',
            {'current_password': 'StrongPass123', 'new_password': 'NewStrongPass123'},
            format='json',
        )
        self.assertEqual(change_response.status_code, 200)

        user.refresh_from_db()
        self.assertTrue(user.check_password('NewStrongPass123'))
