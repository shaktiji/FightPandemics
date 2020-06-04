import unittest
from helpers import is_uuid_v4


class TestIsUUIDV4(unittest.TestCase):

    def test_valid_uuidv4(self):
        self.assertTrue(is_uuid_v4("06c23288-25cf-4fe7-b92a-035ab43d74a8"))

    def test_empty_uuidv4(self):
        self.assertFalse(is_uuid_v4(None))

    def test_invalid_uuidv4(self):
        self.assertFalse(is_uuid_v4("3288-25cf-4fe7-b92a-035ab43d74a8"))
