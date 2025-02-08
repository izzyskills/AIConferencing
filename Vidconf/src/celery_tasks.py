from datetime import datetime
import logging

from sqlmodel import update
from celery import Celery
from src.db.main import get_session
from src.db.models import Room
from src.mail import mail, create_message
from asgiref.sync import async_to_sync

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

c_app = Celery()
c_app.config_from_object("src.config")
session = get_session()


@c_app.task(bind=True, max_retries=3)
def send_email(self, recipients: list[str], subject: str, body: str):
    try:
        message = create_message(recipients=recipients, subject=subject, body=body)
        async_to_sync(mail.send_message)(message)
        logger.info(f"Email sent successfully to {', '.join(recipients)}")
        return {
            "status": "success",
            "message": f'Email sent to {", ".join(recipients)}',
            "task_id": self.request.id,
        }
    except Exception as e:
        logger.error(
            f"Failed to send email to {', '.join(recipients)}. Error: {str(e)}"
        )
        self.retry(exc=e, countdown=60)  # Retry after 60 seconds


def check_email_status(task_id):
    task_result = c_app.AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result,
    }


# Celery task for room state updates
# @c_app.task
# def update_room_states():
#     now = datetime.now()
#     # Activate rooms
#     session.execute(
#         update(Room)
#         .where(Room.opens_at <= now)
#         .where(Room.closes_at > now)
#         .values(current_state='active')
#     )
#
#     # Close expired rooms
#     session.execute(
#         update(Room)
#         .where(Room.closes_at <= now)
#         .values(current_state='ended')
#     )
# Example usage
