# Install required packages

from dotenv import load_dotenv 
import asyncio
import base64
import os
from hume.client import AsyncHumeClient
from hume.empathic_voice.chat.socket_client import ChatConnectOptions, ChatWebsocketConnection
from hume.empathic_voice.chat.types import SubscribeEvent
from hume.core.api_error import ApiError
from hume import MicrophoneInterface, Stream
import sounddevice as sd

# Load environment variables from .env file
load_dotenv()
load_dotenv(encoding='utf-8')
# Get API keys from .env
HUME_API_KEY = os.getenv("HUME_API_KEY")
HUME_SECRET_KEY = os.getenv("HUME_SECRET_KEY")
HUME_CONFIG_ID = os.getenv("HUME_CONFIG_ID")


# WebSocketHandler class to manage WebSocket connection and audio stream
class WebSocketHandler:
    def __init__(self):
        self.socket = None
        self.byte_strs = Stream.new()

    def set_socket(self, socket: ChatWebsocketConnection):
        self.socket = socket

    async def on_open(self):
        print("WebSocket connection opened.")

    async def on_message(self, message: SubscribeEvent):
        if message.type == "chat_metadata":
            pass  # Handle metadata if needed
        elif message.type in ["user_message", "assistant_message"]:
            print(f"{message.message.role.upper()}: {message.message.content}")
        elif message.type == "audio_output":
            message_bytes = base64.b64decode(message.data.encode("utf-8"))
            await self.byte_strs.put(message_bytes)
        elif message.type == "error":
            raise ApiError(f"Error ({message.code}): {message.message}")

    async def on_close(self):
        print("WebSocket connection closed.")

    async def on_error(self, error):
        print(f"Error: {error}")

# Main function to authenticate and establish connection
async def main():
    client = AsyncHumeClient(api_key=HUME_API_KEY)
    options = ChatConnectOptions(config_id=HUME_CONFIG_ID, secret_key=HUME_SECRET_KEY)
    websocket_handler = WebSocketHandler()

    async with client.empathic_voice.chat.connect_with_callbacks(
        options=options,
        on_open=websocket_handler.on_open,
        on_message=websocket_handler.on_message,
        on_close=websocket_handler.on_close,
        on_error=websocket_handler.on_error
    ) as socket:
        websocket_handler.set_socket(socket)
        
        # Start capturing audio from the default microphone and stream it to EVI
        await MicrophoneInterface.start(
            socket,
            allow_user_interrupt=True,
            byte_stream=websocket_handler.byte_strs
        )

# Run the async main function
asyncio.run(main())
