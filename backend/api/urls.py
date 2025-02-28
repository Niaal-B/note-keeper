from django.urls import path
from . import views


urlpatterns = [
    path("notes/",views.NoteListCreate.as_view(),name="note-list"),
    path("notes/delete/<int:pk>/",views.NoteDelete.as_view(),name="delete-note"),
    path("user/",views.Userprofileview.as_view(), name="user_profile"),
    path('profile/', views.ProfilePictureUpdateView.as_view(), name='profile'),
    path("admin/login/",views.AdminLoginView.as_view(),name="admin_login"),
     path("admin/users/", views.AdminUserListView.as_view(), name="admin-user-list"),
    path("admin/users/<int:user_id>/", views.AdminUserDetailView.as_view(), name="admin-user-detail"),
    path("admin/users/", views.list_users, name="list-users"),

    
]