from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User, Book, BookCategory
from .serializers import UserSerializer, BookSerializer, CategorySerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import BookFilter
from rest_framework_simplejwt.authentication import JWTAuthentication

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserDetail(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_object(self):
        return self.request.user


class BookDetails(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]

class BooksList(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = BookFilter

class CategoryList(generics.ListAPIView):
    queryset = BookCategory.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny] 