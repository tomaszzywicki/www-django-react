from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="note-delete"),
    path("user/", views.UserDetail.as_view(), name="user-detail"),
    path("book/<int:pk>", views.BookDetails.as_view(), name="book-details"),
]
