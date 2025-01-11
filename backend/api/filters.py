import django_filters
from .models import Book

class NumberInFilter(django_filters.BaseInFilter, django_filters.NumberFilter):
    pass

class BookFilter(django_filters.FilterSet):
    category = NumberInFilter(field_name='category', lookup_expr='in')

    class Meta:
        model = Book
        fields = ['category']