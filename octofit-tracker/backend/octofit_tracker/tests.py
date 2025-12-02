from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Team, User


class APISmokeTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_root(self):
        url = reverse('api_root')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        self.assertIn('users', resp.data)

    def test_create_team_and_user(self):
        # Create team
        resp = self.client.post('/teams/', {'name': 'marvel'}, format='json')
        self.assertEqual(resp.status_code, 201)
        team_id = resp.data['id']

        # Create user
        resp = self.client.post('/users/', {'name': 'Tony Stark', 'email': 'tony@stark.com', 'team_id': team_id}, format='json')
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data['team']['name'], 'marvel')
