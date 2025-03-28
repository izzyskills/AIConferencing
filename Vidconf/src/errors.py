from typing import Any, Callable

from fastapi import FastAPI, status
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError


class VidconfException(Exception):
    """This is the base class for all bookly errors"""

    pass


class InvalidToken(VidconfException):
    """User has provided an invalid or expired token"""

    pass


class RevokedToken(VidconfException):
    """User has provided a token that has been revoked"""

    pass


class AccessTokenRequired(VidconfException):
    """User has provided a refresh token when an access token is needed"""

    pass


class RefreshTokenRequired(VidconfException):
    """User has provided an access token when a refresh token is needed"""

    pass


class UserAlreadyExists(VidconfException):
    """User has provided an email for a user who exists during sign up."""

    pass


class InvalidCredentials(VidconfException):
    """User has provided wrong email or password during log in."""

    pass


class RoomFullException(VidconfException):
    """Room has reached maximum capacity of 10 members."""

    pass


class RoomNotFoundException(VidconfException):
    """Room not found."""

    pass


class RoomNotSartedException(VidconfException):
    """Room has not started yet."""

    def __init__(self, starting_time):
        self.starting_time = starting_time


class RoomCloasedException(VidconfException):
    """Room has cloased"""

    def __init__(self, closing_time):
        self.closing_time = closing_time


class UserNotFoundException(VidconfException):
    """User not found."""

    pass


class PrivateRoomAccessDeniedException(VidconfException):
    """This room is private. You need an invitation to join."""

    pass


class UserAlreadyInRoomException(VidconfException):
    """You are already a member of this room."""

    pass


class InsufficientPermission(VidconfException):
    """User does not have the neccessary permissions to perform an action."""

    pass


class UserNotFound(VidconfException):
    """User Not found"""

    pass


class AccountNotVerified(Exception):
    """Account not yet verified"""

    pass


def create_exception_handler(
    status_code: int, initial_detail: Any
) -> Callable[[Request, Exception], JSONResponse]:

    async def exception_handler(request: Request, exc: VidconfException):
        detail = initial_detail.copy()
        if isinstance(exc, RoomNotSartedException):
            detail["starting_time"] = exc.starting_time
        elif isinstance(exc, RoomCloasedException):
            detail["closing_time"] = exc.closing_time
        return JSONResponse(content=detail, status_code=status_code)

    return exception_handler


def register_all_errors(app: FastAPI):
    app.add_exception_handler(
        UserAlreadyExists,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_detail={
                "message": "User with email already exists",
                "error_code": "user_exists",
            },
        ),
    )

    app.add_exception_handler(
        UserNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_detail={
                "message": "User not found",
                "error_code": "user_not_found",
            },
        ),
    )
    app.add_exception_handler(
        InvalidCredentials,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            initial_detail={
                "message": "Invalid Email Or Password",
                "error_code": "invalid_email_or_password",
            },
        ),
    )
    app.add_exception_handler(
        InvalidToken,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "message": "Token is invalid Or expired",
                "resolution": "Please get new token",
                "error_code": "invalid_token",
            },
        ),
    )
    app.add_exception_handler(
        RevokedToken,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "message": "Token is invalid or has been revoked",
                "resolution": "Please get new token",
                "error_code": "token_revoked",
            },
        ),
    )
    app.add_exception_handler(
        AccessTokenRequired,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "message": "Please provide a valid access token",
                "resolution": "Please get an access token",
                "error_code": "access_token_required",
            },
        ),
    )
    app.add_exception_handler(
        RefreshTokenRequired,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_detail={
                "message": "Please provide a valid refresh token",
                "resolution": "Please get an refresh token",
                "error_code": "refresh_token_required",
            },
        ),
    )
    app.add_exception_handler(
        InsufficientPermission,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "message": "You do not have enough permissions to perform this action",
                "error_code": "insufficient_permissions",
            },
        ),
    )
    app.add_exception_handler(
        AccountNotVerified,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_detail={
                "message": "Account Not verified",
                "error_code": "account_not_verified",
                "resolution": "Please check your email for verification details",
            },
        ),
    )
    app.add_exception_handler(
        PrivateRoomAccessDeniedException,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_detail={
                "message": "This room is private. You need an invitation to join",
                "error_code": "private_room_access_denied",
            },
        ),
    )
    app.add_exception_handler(
        RoomFullException,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            initial_detail={
                "message": "Room has reached maximum capacity of 10 members",
                "error_code": "room_full",
            },
        ),
    )
    app.add_exception_handler(
        RoomNotFoundException,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_detail={
                "message": "Room not found",
                "error_code": "room_not_found",
            },
        ),
    )
    app.add_exception_handler(
        UserNotFoundException,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_detail={
                "message": "User not found",
                "error_code": "user_not_found",
            },
        ),
    )
    app.add_exception_handler(
        UserAlreadyInRoomException,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            initial_detail={
                "message": "You are already a member of this room",
                "error_code": "user_already_in_room",
            },
        ),
    )
    app.add_exception_handler(
        RoomNotSartedException,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            initial_detail={
                "message": "Room has not started yet",
                "error_code": "room_not_started",
                "starting_time": None,  # This will be updated dynamically
            },
        ),
    )

    app.add_exception_handler(
        RoomCloasedException,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            initial_detail={
                "message": "Room has cloased",
                "error_code": "room_closed",
                "closing_time": None,  # This will be updated dynamically
            },
        ),
    )

    @app.exception_handler(500)
    async def internal_server_error(request, exc):

        return JSONResponse(
            content={
                "message": "Oops! Something went wrong",
                "error_code": "server_error",
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    @app.exception_handler(SQLAlchemyError)
    async def database__error(request, exc):
        print(str(exc))
        return JSONResponse(
            content={
                "message": "Oops! Something went wrong",
                "error_code": "server_error",
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
