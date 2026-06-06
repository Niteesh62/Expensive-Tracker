import json

from django.test import TestCase
from rest_framework.test import APIClient

from .models import Trip, User


class AuthAndExpenseTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {'email': 'tester@example.com', 'password': 'secret123'}
        self.client.post('/api/accounts/register/', self.user_data, format='json')
        self.user = User.objects.get(email=self.user_data['email'])

    def test_register_and_login(self):
        response = self.client.post('/api/accounts/login/', self.user_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('message'), 'Login Successful')

    def test_expense_crud(self):
        create_data = {
            'user': self.user.id,
            'title': 'Lunch',
            'amount': '12.50',
            'category': 'Food',
            'date': '2026-06-06',
            'description': 'Lunch at cafe',
        }

        create_response = self.client.post('/api/accounts/expenses/', create_data, format='json')
        self.assertEqual(create_response.status_code, 201)
        expense_id = create_response.json().get('id')
        self.assertIsNotNone(expense_id)

        get_response = self.client.get(f'/api/accounts/expenses/{expense_id}/')
        self.assertEqual(get_response.status_code, 200)
        self.assertEqual(get_response.json().get('title'), 'Lunch')

        update_data = create_data.copy()
        update_data['title'] = 'Lunch Updated'
        update_response = self.client.put(f'/api/accounts/expenses/{expense_id}/', update_data, format='json')
        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.json().get('title'), 'Lunch Updated')

        delete_response = self.client.delete(f'/api/accounts/expenses/{expense_id}/')
        self.assertEqual(delete_response.status_code, 204)

        not_found_response = self.client.get(f'/api/accounts/expenses/{expense_id}/')
        self.assertEqual(not_found_response.status_code, 404)

    def test_trip_crud(self):
        create_data = {
            'user': self.user.id,
            'destination': 'Goa',
            'start_date': '2026-06-10',
            'end_date': '2026-06-15',
            'budget': '15000.00',
            'status': 'Upcoming',
        }

        create_response = self.client.post('/api/accounts/trips/', create_data, format='json')
        self.assertEqual(create_response.status_code, 201)
        trip_id = create_response.json().get('id')
        self.assertIsNotNone(trip_id)

        get_response = self.client.get(f'/api/accounts/trips/{trip_id}/')
        self.assertEqual(get_response.status_code, 200)
        self.assertEqual(get_response.json().get('destination'), 'Goa')

        update_data = create_data.copy()
        update_data['destination'] = 'Goa Updated'
        update_response = self.client.put(f'/api/accounts/trips/{trip_id}/', update_data, format='json')
        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.json().get('destination'), 'Goa Updated')

        delete_response = self.client.delete(f'/api/accounts/trips/{trip_id}/')
        self.assertEqual(delete_response.status_code, 204)

        not_found_response = self.client.get(f'/api/accounts/trips/{trip_id}/')
        self.assertEqual(not_found_response.status_code, 404)
