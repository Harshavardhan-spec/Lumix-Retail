import os
import sys

from django.core.asgi import get_asgi_application

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
apps_dir = os.path.join(base_dir, "apps")
if apps_dir not in sys.path:
    sys.path.insert(0, apps_dir)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "retailmind.settings")

application = get_asgi_application()
