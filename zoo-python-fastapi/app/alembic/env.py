from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config

from app.config import Config
from app.models import Base  # Import your models

# This is the Alembic Config object, which provides access to the values within the .ini file in use.
config = context.config

# Get DSN from ENV VARS via app config
config.set_main_option("sqlalchemy.url", Config.DSN)

# Interpret the config file for Python logging.
fileConfig(config.config_file_name)

# Add your model's MetaData object here
target_metadata = Base.metadata


# Get the connection URL from the configuration
def get_url():
    return config.get_main_option("sqlalchemy.url")


# Run migrations in 'offline' mode
def run_migrations_offline():
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


# Run migrations in 'online' mode with async support
async def run_migrations_online():
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def do_run_migrations(connection):
    context.configure(connection=connection,
                      target_metadata=target_metadata,
                      transaction_per_migration=True  # Enable transactional migrations
                      )

    with context.begin_transaction():
        context.run_migrations()

    # Determine whether to run in offline or online mode
    if context.is_offline_mode():
        run_migrations_offline()
    else:
        import asyncio

    asyncio.run(run_migrations_online())
