from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "role", "is_staff", "is_active", "created_at")
    list_filter = ("role", "is_staff", "is_active")
    search_fields = ("username", "email")
    ordering = ("-created_at",)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ("RetailMind Extra Fields", {"fields": ("role",)}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("RetailMind Extra Fields", {"fields": ("role",)}),
    )
