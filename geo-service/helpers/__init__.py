import re

# constants
# Source: https://stackoverflow.com/a/12808694/4582054
UUID_V4_RE = r'^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$'


def is_uuid_v4(uuid_v4=''):
    if uuid_v4 is None:
        return False
    elif re.match(UUID_V4_RE, uuid_v4, flags=re.IGNORECASE) is None:
        return False
    else:
        return True
