from django.core.management.base import BaseCommand
from django.db import connection
from octofit_tracker.models import Team, User, Workout, Activity, Leaderboard
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Clear existing data via ORM
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        User.objects.all().delete()
        Team.objects.all().delete()
        Workout.objects.all().delete()

        # Create teams
        marvel = Team.objects.create(name='marvel')
        dc = Team.objects.create(name='dc')

        # Create users (super heroes)
        heroes = [
            ('Tony Stark', 'tony@stark.com', marvel),
            ('Steve Rogers', 'steve@avengers.com', marvel),
            ('Peter Parker', 'peter@spidey.com', marvel),
            ('Bruce Wayne', 'bruce@wayne.com', dc),
            ('Clark Kent', 'clark@dailyplanet.com', dc),
            ('Diana Prince', 'diana@amazon.com', dc),
        ]

        users = []
        for name, email, team in heroes:
            users.append(User.objects.create(name=name, email=email, team=team))

        # Workouts
        workouts = [
            Workout.objects.create(title='Morning Run', description='5k easy pace', difficulty='easy'),
            Workout.objects.create(title='Strength Training', description='Full-body compound lifts', difficulty='hard'),
            Workout.objects.create(title='Yoga Flow', description='Flexibility and balance', difficulty='medium'),
        ]

        # Activities
        Activity.objects.create(user=users[0], type='run', duration_minutes=30, date=date.today(), notes='Park loop')
        Activity.objects.create(user=users[3], type='lift', duration_minutes=45, date=date.today(), notes='Batcave gym')
        Activity.objects.create(user=users[2], type='yoga', duration_minutes=40, date=date.today(), notes='Home practice')
        Activity.objects.create(user=users[5], type='swim', duration_minutes=50, date=date.today(), notes='Training pool')

        # Leaderboard points (simple totals)
        Leaderboard.objects.create(team=marvel, points=120)
        Leaderboard.objects.create(team=dc, points=115)

        # Ensure unique index on users.email via raw collection
        # Djongo exposes the underlying pymongo client through connection
        db_conn = connection.cursor().db_conn
        users_coll = db_conn['octofit_db']['octofit_tracker_user']
        # Create unique index if not present
        users_coll.create_index('email', unique=True)

        self.stdout.write(self.style.SUCCESS('Database populated with sample data and unique email index ensured.'))
