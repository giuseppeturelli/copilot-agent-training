from django.db import models


class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    team = models.ForeignKey(Team, related_name='members', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.name} <{self.email}>"


class Workout(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    difficulty = models.CharField(max_length=50, choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')])

    def __str__(self):
        return self.title


class Activity(models.Model):
    ACTIVITY_TYPES = [
        ('run', 'Run'),
        ('bike', 'Bike'),
        ('swim', 'Swim'),
        ('lift', 'Lift'),
        ('yoga', 'Yoga'),
    ]
    user = models.ForeignKey(User, related_name='activities', on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    duration_minutes = models.PositiveIntegerField()
    date = models.DateField()
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.name} - {self.type} ({self.duration_minutes}m)"


class Leaderboard(models.Model):
    team = models.ForeignKey(Team, related_name='leaderboard_entries', on_delete=models.CASCADE)
    points = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'Leaderboard Entry'
        verbose_name_plural = 'Leaderboard'

    def __str__(self):
        return f"{self.team.name}: {self.points}"
