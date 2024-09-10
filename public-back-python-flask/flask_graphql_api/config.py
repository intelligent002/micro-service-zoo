import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DB_DSN')
    SQLALCHEMY_TRACK_MODIFICATIONS = False