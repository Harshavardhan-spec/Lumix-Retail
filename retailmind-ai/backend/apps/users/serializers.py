from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for displaying User details."""

    class Meta:
        model = User
        fields = ("id", "username", "email", "role", "created_at")
        read_only_fields = ("id", "created_at")


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for registering new users."""

    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "role")

    def create(self, validated_data: dict) -> User:
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data.get("role", User.ROLE_RETAILER),
        )
        return user
