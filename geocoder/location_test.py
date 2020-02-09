import unittest
from location import Geocoder

class LocationTest(unittest.TestCase):
    def test_geocode_addr(self):
        with Geocoder() as g:
            addr = g.geocode_address("1330 Monterey Street")
            self.assertEqual(1, len(addr))

def main():
    unittest.main()

if __name__ == "__main__":
    main()