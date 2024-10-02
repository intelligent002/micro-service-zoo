from unicodedata import normalize
import re

def validate_version(version):
    # Check if the version matches the expected pattern (YYYY-MM-DD---HH-MM-SS)
    return re.match(r'^\d{4}-\d{2}-\d{2}---\d{2}-\d{2}-\d{2}$', version)


def secure_filename(filename: str) -> str:
    """
    A function to sanitize a filename, similar to Flask's `secure_filename`.
    It removes special characters, ensures the filename is safe, and returns a valid name.
    """
    # Normalize the Unicode filename to prevent issues with special characters
    filename = normalize('NFKD', filename).encode('ascii', 'ignore').decode('ascii')

    # Remove any characters that are not letters, digits, underscores, or dots
    filename = re.sub(r'[^A-Za-z0-9_.-]', '', filename)

    # Ensure filename is not empty, replace any leading or trailing dots
    return filename.strip('._')