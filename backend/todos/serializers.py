from rest_framework import serializers
from .models import Todo
from django.contrib.auth.models import User

# Todo Serializer
class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'user', 'title', 'description', 'status', 'priority', 'due_date', 'completed', 'created_at']
        read_only_fields = ['user', 'created_at']

    def validate(self, attrs):
        status = attrs.get('status')
        completed = attrs.get('completed')
        instance = getattr(self, 'instance', None)

        if status is None and completed is not None:
            if completed:
                attrs['status'] = 'done'
            elif instance and instance.status == 'done':
                attrs['status'] = 'todo'

        if status == 'done':
            attrs['completed'] = True
        elif status in ('todo', 'doing') and completed is True:
            attrs['status'] = 'done'
        elif status in ('todo', 'doing') and completed is None:
            attrs['completed'] = False

        return attrs

# User Serializer (for signup)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
