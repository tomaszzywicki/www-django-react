from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User, Book, BookCategory, Comment
from .serializers import UserSerializer, BookSerializer, CategorySerializer, CommentSerializer
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

class CommentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        book_id = self.kwargs.get('book_id')
        return Comment.objects.filter(book__id=book_id).order_by('-created_at')

    def perform_create(self, serializer):
        book_id = self.kwargs.get('book_id')
        book = generics.get_object_or_404(Book, id=book_id)
        serializer.save(user=self.request.user, book=book)

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of a comment to delete it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user == request.user

class CommentDeleteAPIView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]