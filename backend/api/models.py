from datetime import timedelta
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.timezone import now

# Create your models here.

class BookCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    description = models.TextField()
    available_copies = models.IntegerField()
    category = models.ForeignKey(
        BookCategory, on_delete=models.SET_NULL, null=True, related_name="books"
    )
    cover_image = models.ImageField(upload_to="covers/", null=True, blank=True)

    def __str__(self):
        return f"{self.title}, {self.available_copies} copies"


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')

    class Meta:
        ordering = ['-order_date']

class Comment(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return f"{self.user.username} commented on {self.book.title}"