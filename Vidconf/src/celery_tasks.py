from datetime import datetime
import logging

from sqlmodel import select, update
from celery import Celery
from src.db.main import get_sync_session
from src.db.models import MeetingExtracts, Room
from src.mail import mail, create_message
from asgiref.sync import async_to_sync
import assemblyai as aai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

c_app = Celery()
c_app.config_from_object("src.config")


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


@c_app.task(bind=True, max_retries=3)
def transcribe_and_summarize_audio(
    self, file_path: str, extract_id: str, recipients: list[str], is_admin: bool
):
    try:
        # Create a new synchronous session for this task context
        with get_sync_session() as session:
            # Step 1: Transcribe the audio file
            transcriber = aai.Transcriber()
            transcript = transcriber.transcribe(file_path)

            # Step 2: Define a summarization prompt
            prompt = "Provide a summary of the transcript, in an email friendly manner"

            # Step 3: Apply LeMUR
            result = transcript.lemur.task(
                prompt, final_model=aai.LemurModel.claude3_5_sonnet
            )
            summary = result.response

            # Update the MeetingExtracts table with the transcript and summary links
            # Use SQLModel compatible syntax
            statement = select(MeetingExtracts).where(MeetingExtracts.id == extract_id)
            extract_result = session.exec(statement)
            extract = extract_result.first()

            if not extract:
                raise ValueError(f"No extract found with ID: {extract_id}")

            extract.transcript_link = transcript.text
            extract.summary_link = summary
            session.commit()

            # Prepare email content
            email_subject = "Meeting Transcript and Summary"
            email_body = f"Summary:\n{summary}"
            if is_admin:
                email_body += f"\n\nFull Transcript:\n{transcript.text}"
            print(summary)
            print(transcript.text)
            # Send email
            send_email.delay(recipients, email_subject, email_body)

            logger.info(
                f"Transcription and summarization completed for file {file_path}"
            )
            return {
                "status": "success",
                "message": f"Transcription and summarization completed for file {file_path}",
                "task_id": self.request.id,
            }
    except Exception as e:
        logger.error(
            f"Failed to transcribe and summarize audio file {file_path}. Error: {str(e)}"
        )
        self.retry(exc=e, countdown=60)


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
