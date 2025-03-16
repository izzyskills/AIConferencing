web: cd Vidconf && fastapi run --workers 4 src/ --host=0.0.0.0 --port=${PORT:-5000}
worker: cd Vidconf && celery -A src.celery_tasks.c_app worker --loglevel=info

