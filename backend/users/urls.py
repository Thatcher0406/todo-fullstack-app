from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('signup/', views.SignUpView.as_view(), name='signup'),

    # JWT login endpoint
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Refresh token endpoint
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
