from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Book, BookCategory, BookCopy, Loan


admin.site.register(Book)
admin.site.register(BookCategory)
admin.site.register(BookCopy)
admin.site.register(Loan)
