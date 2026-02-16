from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from todos.views import MyTokenObtainPairView

urlpatterns = [
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('me/', views.CurrentUserView.as_view(), name='current_user'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),

    # JWT login endpoint (use custom view)
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Refresh token endpoint
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
