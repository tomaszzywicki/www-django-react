from os import name
from django.urls import path
from . import views


urlpatterns = [
    path("user/", views.UserDetail.as_view(), name="user-detail"),
    path("book/<int:pk>", views.BookDetails.as_view(), name="book-details"),
    path("books/", views.BooksList.as_view(), name="book-list"),
    path("categories/", views.CategoryList.as_view(), name="category-list"),
    path("book/<int:book_id>/comments/", views.CommentListCreateAPIView.as_view(), name="comment-list-create"),
    path("comments/<int:pk>/", views.CommentDeleteAPIView.as_view(), name="comment-delete"),
    path('book/<int:book_id>/order/', views.OrderCreateView.as_view(), name='order-book'),
    path('user/orders/', views.UserOrdersView.as_view(), name='user-orders'),
    path('orders/<int:order_id>/cancel/', views.CancelOrderView.as_view(), name='cancel-order')
]