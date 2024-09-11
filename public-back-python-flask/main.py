import os

# run.py
from app.application import create_app
from app.config import Config  # Import the db instance

app = create_app()

print("debug mode is: " + os.getenv('FLASK_DEBUG', 'False').lower() == 'true')

if __name__ == "__main__":
    # Toggle debug mode using an environment variable
    app.run(debug=Config.DEBUG_MODE)
