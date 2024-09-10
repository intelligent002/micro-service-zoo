import os

# Explicitly check if any environment variable is missing
db_username = os.getenv('DB_USERNAME')
db_password = os.getenv('DB_PASSWORD')
db_hostname = os.getenv('DB_HOSTNAME')
db_database = os.getenv('DB_DATABASE')

if not all([db_username, db_password, db_hostname, db_database]):
    raise ValueError("One or more environment variables are missing: DB_USERNAME, DB_PASSWORD, DB_HOSTNAME, DB_DATABASE")

class Config:
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{db_username}:{db_password}@{db_hostname}:3306/{db_database}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

