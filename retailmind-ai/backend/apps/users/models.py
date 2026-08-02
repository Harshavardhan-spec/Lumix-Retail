from django.contrib.auth.models import AbstractUser
from django.db import models
from typing import List, Tuple


class User(AbstractUser):
    """Custom User model for RetailMind AI supporting multi-tier roles."""

    ROLE_ADMIN = "admin"
    ROLE_DISTRIBUTOR = "distributor"
    ROLE_RETAILER = "retailer"

    ROLE_CHOICES: List[Tuple[str, str]] = [
        (ROLE_ADMIN, "Admin"),
        (ROLE_DISTRIBUTOR, "FMCG Distributor"),
        (ROLE_RETAILER, "Retailer Store Manager"),
    ]

    email = models.EmailField(unique=True, help_text="User's primary email address")
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_RETAILER,
        help_text="Role determining permissions and analytics scope",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS = ["email"]

    def __str__(self) -> str:
        return f"{self.username} ({self.get_role_display()})"
