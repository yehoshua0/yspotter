from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.auth.models import User

class Trip(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    curr_location = gis_models.PointField(null=True, blank=True, help_text="Current location as (longitude, latitude)")
    pick_location = gis_models.PointField(help_text="Pickup location as (longitude, latitude)")
    drop_location = gis_models.PointField(help_text="Dropoff location as (longitude, latitude)")
    cycle_hours = models.PositiveIntegerField(default=0, help_text="Current cycle used in hours")
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')

    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(cycle_hours__lte=70), name='max_70_hours')
        ]

class Route(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='routes')
    title = models.CharField(max_length=100)
    route_path = gis_models.LineStringField(null=True, blank=True, help_text="GeoJSON or LineString for map route")
    stops = models.JSONField(default=list, blank=True, help_text="List of stops: [{'lat': float, 'lng': float, 'type': str}]")
    distance_miles = models.FloatField(default=0, help_text="Total distance in miles")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class DailyLog(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='logs')
    date = models.DateField()
    hours_driven = models.PositiveIntegerField(default=0)
    fuel_stops = models.JSONField(default=list, blank=True, help_text="List of fuel stops: [{'mileage': float, 'location': str}]")
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Log for {self.route.title} on {self.date}"