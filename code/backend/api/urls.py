from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('trips/', views.TripListCreate.as_view(), name='trip_list_create'),
    path('trips/<int:pk>/', views.TripDelete.as_view(), name='trip_delete'),
    path('routes/', views.RouteListCreate.as_view(), name='route_list_create'),
    path('routes/<int:pk>/', views.RouteDelete.as_view(), name='route_delete'),
    path('dailylogs/', views.DailyLogListCreate.as_view(), name='dailylog_list_create'),
    path('dailylogs/<int:pk>/', views.DailyLogDelete.as_view(), name='dailylog_delete'),
]