import os

# Explicitly check if any environment variable is missing
db_username = os.getenv('DB_USERNAME')
db_password = os.getenv('DB_PASSWORD')
db_hostname = os.getenv('DB_HOSTNAME')
db_database = os.getenv('DB_DATABASE')
db_port = os.getenv('DB_PORT', '3306')

if not all([db_username, db_password, db_hostname, db_database]):
    error = "One or more environment variables are missing: DB_USERNAME, DB_PASSWORD, DB_HOSTNAME, DB_DATABASE"
    # current_app.logger.error(error)
    raise ValueError(error)


class Config:
    DSN = f"mysql+aiomysql://{db_username}:{db_password}@{db_hostname}:{db_port}/{db_database}"
    DEBUG_MODE = os.getenv('DEBUG_MODE', 'False').lower() == 'true'
    APP_PORT = os.getenv('APP_PORT', 8001)
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'DEBUG').upper()

    # Directory to store schema files
    SCHEMA_DIR = os.path.join(os.getcwd(), 'schemas')
    os.makedirs(SCHEMA_DIR, exist_ok=True)
