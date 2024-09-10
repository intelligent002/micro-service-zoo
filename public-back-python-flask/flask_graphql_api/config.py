import os


class Config:
    SQLALCHEMY_DATABASE_URI = ("mysql+pymysql://" +
                               os.getenv('DB_USERNAME') + ":" +
                               os.getenv('DB_PASSWORD') + "@" +
                               os.getenv('DB_HOSTNAME') + ":3306/" +
                               os.getenv('DB_DATABASE'))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
