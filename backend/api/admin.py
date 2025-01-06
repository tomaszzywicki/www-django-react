from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Note, Book, BookCategory, BookCopy, Loan


admin.site.register(Note)
admin.site.register(Book)
admin.site.register(BookCategory)
admin.site.register(BookCopy)
admin.site.register(Loan)
