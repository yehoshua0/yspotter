from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Trip, Route, DailyLog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user

class TripSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(read_only=True)  # Display author ID only

    class Meta:
        model = Trip
        fields = [
            'id',           # Auto-incremented primary key
            'name',         # Trip name
            'description',  # Trip description
            'curr_location',# Current location (PointField)
            'pick_location',# Pickup location (PointField)
            'drop_location',# Dropoff location (PointField)
            'cycle_hours',  # Current cycle used in hours
            'created_at',   # Timestamp of creation
            'author',       # User who created the trip
        ]
        extra_kwargs = {
            'created_at': {'read_only': True},  # Auto-set by model
            'author': {'read_only': True},      # Set in view, not via input
        }

    def validate_cycle_hours(self, value):
        """Ensure cycle_hours does not exceed 70 hours."""
        if value > 70:
            raise serializers.ValidationError("Cycle hours cannot exceed 70 hours per 8-day period.")
        return value

    def validate(self, data):
        """Custom validation for required fields."""
        if not data.get('name'):
            raise serializers.ValidationError({"name": "Trip name is required."})
        if not data.get('pick_location'):
            raise serializers.ValidationError({"pick_location": "Pickup location is required."})
        if not data.get('drop_location'):
            raise serializers.ValidationError({"drop_location": "Dropoff location is required."})
        return data

    def to_representation(self, instance):
        """Convert PointField to readable lat/lng format."""
        representation = super().to_representation(instance)
        for field in ['curr_location', 'pick_location', 'drop_location']:
            point = getattr(instance, field)
            if point:
                representation[field] = {'latitude': point.y, 'longitude': point.x}
            else:
                representation[field] = None
        return representation
    
    def create(self, validated_data):
        try:
            print("Validated Data:", validated_data)  # Debugging
            trip = Trip.objects.create(**validated_data)
            return trip
        except Exception as e:
            print("Error in Trip Creation:", str(e))  # Print the error
            raise serializers.ValidationError({"detail": str(e)})

class RouteSerializer(serializers.ModelSerializer):
    trip = serializers.PrimaryKeyRelatedField(queryset=Trip.objects.all())  # Link to Trip

    class Meta:
        model = Route
        fields = [
            'id',           # Auto-incremented primary key
            'trip',         # Foreign key to Trip
            'title',        # Route title
            'route_path',   # LineStringField for map route
            'stops',        # JSONField for stops
            'distance_miles', # Total distance in miles
            'created_at',   # Timestamp of creation
        ]
        extra_kwargs = {
            'created_at': {'read_only': True},  # Auto-set by model
        }

    def validate_distance_miles(self, value):
        """Warn if distance exceeds 1,000 miles without fuel stops."""
        if value > 1000 and not self.initial_data.get('stops'):
            raise serializers.ValidationError(
                "Routes exceeding 1,000 miles should include fuel stops in the 'stops' field."
            )
        return value

    def validate_stops(self, value):
        """Ensure stops is a valid list of dictionaries with lat/lng."""
        if not isinstance(value, list):
            raise serializers.ValidationError("Stops must be a list.")
        for stop in value:
            if not all(k in stop for k in ['lat', 'lng', 'type']):
                raise serializers.ValidationError(
                    "Each stop must have 'lat', 'lng', and 'type' keys."
                )
        return value

    def to_representation(self, instance):
        """Convert LineStringField to GeoJSON-like format."""
        representation = super().to_representation(instance)
        route_path = instance.route_path
        if route_path:
            representation['route_path'] = {
                'type': 'LineString',
                'coordinates': [[point[0], point[1]] for point in route_path.coords]
            }
        else:
            representation['route_path'] = None
        return representation
    
    def create(self, validated_data):
        try:
            print("Validated Data:", validated_data)  # Debugging
            route = Route.objects.create(**validated_data)
            return route
        except Exception as e:
            print("Error in Route Creation:", str(e))  # Print the error
            raise serializers.ValidationError({"detail": str(e)})

class DailyLogSerializer(serializers.ModelSerializer):
    route = serializers.PrimaryKeyRelatedField(queryset=Route.objects.all())

    class Meta:
        model = DailyLog
        fields = [
            'id',           # Auto-incremented primary key
            'route',        # Foreign key to Route
            'date',         # Date of the log
            'hours_driven', # Hours driven on this date
            'fuel_stops',   # JSONField for fuel stops
            'notes',        # Optional notes
        ]

    def validate_hours_driven(self, value):
        """Ensure hours_driven is reasonable (e.g., <= 24 hours/day)."""
        if value > 24:
            raise serializers.ValidationError("Hours driven cannot exceed 24 hours in a day.")
        return value

    def validate_fuel_stops(self, value):
        """Ensure fuel_stops is a valid list of dictionaries with mileage and location."""
        if not isinstance(value, list):
            raise serializers.ValidationError("Fuel stops must be a list.")
        for stop in value:
            if not all(k in stop for k in ['mileage', 'location']):
                raise serializers.ValidationError(
                    "Each fuel stop must have 'mileage' and 'location' keys."
                )
            if not isinstance(stop['mileage'], (int, float)) or stop['mileage'] < 0:
                raise serializers.ValidationError("Mileage must be a non-negative number.")
        return value

    def validate(self, data):
        """Ensure date and route are provided."""
        if not data.get('date'):
            raise serializers.ValidationError({"date": "Date is required."})
        if not data.get('route'):
            raise serializers.ValidationError({"route": "Route is required."})
        return data
    
    def create(self, validated_data):
        try:
            print("Validated Data:", validated_data)  # Debugging
            log = DailyLog.objects.create(**validated_data)
            return log
        except Exception as e:
            print("Error in DailyLog Creation:", str(e))  # Print the error
            raise serializers.ValidationError({"detail": str(e)})