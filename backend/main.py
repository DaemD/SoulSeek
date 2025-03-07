# backend/main.py
from fastapi import FastAPI
import subprocess
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if your React app runs on a different port
    allow_methods=["*"],
    allow_headers=["*"],
)

# Track the subprocess globally
hume_process = None

# Define a route for the root URL
@app.get("/")
async def read_root():
    return {"message": "Welcome to SoulSpeak Backend!"}

# API endpoint to start the Hume AI session
@app.get("/api/start-session/")
async def start_session():
    global hume_process
    if hume_process is None or hume_process.poll() is not None:
        print("Received request to start session")
        try:
            # Run the script
            hume_process = subprocess.Popen(
                ["python", "hume_ai_script.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            return {"status": "started", "message": "Hume AI session started!"}
        except FileNotFoundError:
            print("hume_ai_script.py not found.")
            return {"status": "error", "message": "hume_ai_script.py not found."}
        except Exception as e:
            print("Exception occurred:", str(e))
            return {"status": "error", "message": str(e)}
    else:
        return {"status": "running", "message": "Hume AI session is already running."}

# API endpoint to stop the Hume AI session
@app.get("/api/stop-session/")
async def stop_session():
    global hume_process
    if hume_process and hume_process.poll() is None:
        print("Received request to stop session")
        hume_process.terminate()  # Send termination signal
        hume_process.wait()       # Wait for process to terminate
        return {"status": "stopped", "message": "Hume AI session stopped!"}
    else:
        return {"status": "not_running", "message": "Hume AI session is not running."}
