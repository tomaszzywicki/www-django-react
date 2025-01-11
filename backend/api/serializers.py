from rest_framework import serializers
from .models import Book, BookCopy, Loan, User, BookCategory

# Konwertuje modele Django na JSON i na odwrót

class BookSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "author",
            "description",
            "total_copies",
            "category",
            "cover_image",
        ]

    def get_cover_image(self, obj):
        request = self.context.get("request")
        if obj.cover_image and hasattr(obj.cover_image, "url"):
            return request.build_absolute_uri(obj.cover_image.url)
        return None


class BookCopySerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    class Meta:
        model = BookCopy
        fields = ["id", "book", "is_available"]


class LoanSerializer(serializers.ModelSerializer):
    book = BookCopySerializer(read_only=True)

    class Meta:
        model = Loan
        fields = ["id", "book", "loan_date", "return_due_date", "extensions"]


class UserSerializer(serializers.ModelSerializer):
    loans = LoanSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "password",
            "email",
            "loans",
        ]
        extra_kwargs = {"password": {"write_only": True, "required": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCategory
        fields = ['id', 'name']