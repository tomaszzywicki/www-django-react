from rest_framework import serializers
from .models import Book, BookCopy, Loan, User, BookCategory

# Konwertuje modele Django na JSON i na odwrót

class BookSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()
    category = serializers.SlugRelatedField(slug_field="name", read_only=True)

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
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    password2 = serializers.CharField(write_only=True, required=False, allow_blank=True, label="Confirm Password")
    

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "password",
            "password2",
            "email",
            "loans",
        ]
        extra_kwargs = {"password": {"write_only": True, "required": False}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        password2 = validated_data.pop("password2", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        validated_data.pop("password2", None)
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance

    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")

        if password or password2:
            if password != password2:
                raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCategory
        fields = ['id', 'name']