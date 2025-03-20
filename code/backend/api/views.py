from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, TripSerializer, RouteSerializer, DailyLogSerializer
from .models import Trip, Route, DailyLog

# User View
class UserListView(generics.ListAPIView):
    """List users for the authenticated user."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# User Creation View
class CreateUserView(generics.CreateAPIView):
    """Create a new user without authentication requirement."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# Trip Views
class TripListCreate(generics.ListCreateAPIView):
    """List and create trips for the authenticated user."""
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return trips created by the authenticated user."""
        user = self.request.user
        return Trip.objects.filter(author=user)

    def perform_create(self, serializer):
        """Save the trip with the authenticated user as the author."""
        serializer.save(author=self.request.user)

class TripDelete(generics.DestroyAPIView):
    """Delete a trip owned by the authenticated user."""
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return trips created by the authenticated user."""
        user = self.request.user
        return Trip.objects.filter(author=user)

# Route Views
class RouteListCreate(generics.ListCreateAPIView):
    """List and create routes for trips owned by the authenticated user."""
    serializer_class = RouteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return routes for trips created by the authenticated user."""
        user = self.request.user
        return Route.objects.filter(trip__author=user)

    def perform_create(self, serializer):
        """Save the route with a trip owned by the authenticated user."""
        trip_id = self.request.data.get('trip')  # Expect trip ID in request data
        trip = Trip.objects.filter(id=trip_id, author=self.request.user).first()
        if not trip:
            raise serializers.ValidationError("Trip not found or not owned by user.")
        serializer.save(trip=trip)

class RouteDelete(generics.DestroyAPIView):
    """Delete a route linked to a trip owned by the authenticated user."""
    serializer_class = RouteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return routes for trips created by the authenticated user."""
        user = self.request.user
        return Route.objects.filter(trip__author=user)

# DailyLog Views
class DailyLogListCreate(generics.ListCreateAPIView):
    """List and create daily logs for routes linked to trips owned by the authenticated user."""
    serializer_class = DailyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return daily logs for routes of trips created by the authenticated user."""
        user = self.request.user
        return DailyLog.objects.filter(route__trip__author=user)

    def perform_create(self, serializer):
        """Save the daily log with a route owned by the authenticated user."""
        route_id = self.request.data.get('route')
        route = Route.objects.filter(id=route_id, trip__author=self.request.user).first()
        if not route:
            raise serializers.ValidationError("Route not found or not linked to a trip owned by user.")
        serializer.save(route=route)

class DailyLogDelete(generics.DestroyAPIView):
    """Delete a daily log linked to a route owned by the authenticated user."""
    serializer_class = DailyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return daily logs for routes of trips created by the authenticated user."""
        user = self.request.user
        return DailyLog.objects.filter(route__trip__author=user)