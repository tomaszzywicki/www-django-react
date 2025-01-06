from datetime import timedelta
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.timezone import now

# Create your models here.


class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title


class BookCategory(models.Model):
    name = models.CharField(max_length=100)


class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    description = models.TextField()
    total_copies = models.IntegerField()
    category = models.ForeignKey(
        BookCategory, on_delete=models.SET_NULL, null=True, related_name="books"
    )
    cover_image = models.ImageField(upload_to="covers/", null=True, blank=True)

    def __str__(self):
        return f"{self.title}, {self.total_copies} copies"


class BookCopy(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="copies")
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"Copy of {self.book.title} (Available: {self.is_available})"


class Loan(models.Model):
    def calculate_return_date(days=30):
        return now() + timedelta(days)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="loans")
    book = models.ForeignKey(BookCopy, on_delete=models.CASCADE, related_name="loans")
    loan_date = models.DateTimeField(default=now)
    return_due_date = models.DateTimeField(default=calculate_return_date())
    extensions = models.PositiveIntegerField(default=0)
