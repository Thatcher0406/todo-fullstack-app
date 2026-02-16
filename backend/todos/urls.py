from django.urls import path
from .views import UserCreateView, TodoListCreateView, TodoRetrieveUpdateDestroyView, MyTokenObtainPairView

urlpatterns = [
    path('signup/', UserCreateView.as_view(), name='signup'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('todos/', TodoListCreateView.as_view(), name='todo_list_create'),
    path('todos/<int:pk>/', TodoRetrieveUpdateDestroyView.as_view(), name='todo_detail'),
]
