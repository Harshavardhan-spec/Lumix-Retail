from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, RegisterSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """API endpoint to register a new user."""
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class CurrentUserView(generics.RetrieveAPIView):
    """API endpoint to retrieve details of current authenticated user."""
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self) -> User:
        return self.request.user


class LogoutView(APIView):
    """API endpoint to logout user by blacklisting refresh token."""
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request) -> Response:
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
