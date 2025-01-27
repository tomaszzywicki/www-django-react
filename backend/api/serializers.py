from rest_framework import serializers
from .models import Book  , User, BookCategory, Comment, Order

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCategory
        fields = ['id', 'name']

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True) 

    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at']

# Serializer dla Book
class BookSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()
    category = serializers.SlugRelatedField(slug_field="name", read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "author",
            "description",
            "available_copies",
            "category",
            "category_id",
            "cover_image",
            "comments"
        ]

    def get_cover_image(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request is not None:
            return request.build_absolute_uri(obj.cover_image.url)
        return None  



# Serializer dla User
class UserSerializer(serializers.ModelSerializer):
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

class OrderSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'book', 'order_date', 'status']