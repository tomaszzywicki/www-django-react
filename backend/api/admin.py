from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Book, BookCategory, Order


admin.site.register(Book)
admin.site.register(BookCategory)
admin.site.register(Order)
