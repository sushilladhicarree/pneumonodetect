from django.urls import path, include
from . import views
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router=routers.DefaultRouter()
router.register('customer', views.CustomerView, basename="customer")
router.register('report', views.ReportView, basename="report")

urlpatterns=[
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('total-scans/', views.ScansCountView.as_view(), name='total-scans'),
    path('current-user-details/', views.CurrentUserDetailsView.as_view(), name='current-user'),
]