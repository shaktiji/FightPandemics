import unittest
from models.location import Location


class TestLocation(unittest.TestCase):

    def test_place_full_details(self):
        """from place/details/json?\
            place_id=EjA1IEFydGh1ciBTdHJlZXQgV2VzdCwgVGhvcm5idXJ5LCBPbnRhcmlvLCBDYW5hZGEiMBIuChQKEgmvblgT1XQqiBEwy1V62GLLPRAFKhQKEgmt3-XB1QoqiBEaKwtTJIpSTw\
            &fields=address_component,formatted_address,geometry"""
        gmaps_result = {
            'address_components': [
                {
                    'long_name': '5',
                    'short_name': '5',
                    'types': [
                        'street_number'
                    ]
                },
                {
                    'long_name': 'Arthur Street West',
                    'short_name': 'Arthur St W',
                    'types': [
                        'route'
                    ]
                },
                {
                    'long_name': 'Thornbury',
                    'short_name': 'Thornbury',
                    'types': [
                        'neighborhood',
                        'political'
                    ]
                },
                {
                    'long_name': 'The Blue Mountains',
                    'short_name': 'The Blue Mountains',
                    'types': [
                        'locality',
                        'political'
                    ]
                },
                {
                    'long_name': 'Grey County',
                    'short_name': 'Grey County',
                    'types': [
                        'administrative_area_level_2',
                        'political'
                    ]
                },
                {
                    'long_name': 'Ontario',
                    'short_name': 'ON',
                    'types': [
                        'administrative_area_level_1',
                        'political'
                    ]
                },
                {
                    'long_name': 'Canada',
                    'short_name': 'CA',
                    'types': [
                        'country',
                        'political'
                    ]
                },
                {
                    'long_name': 'N0H 2P0',
                    'short_name': 'N0H 2P0',
                    'types': [
                        'postal_code'
                    ]
                }
            ],
            'formatted_address': '5 Arthur St W, Thornbury, ON N0H 2P0, Canada',
            'geometry': {
                'location': {
                    'lat': 44.5620158,
                    'lng': -80.4532732
                }
            }
        }
        expected = {
            'address': '5 Arthur St W, Thornbury, ON N0H 2P0, Canada',
            'city': 'The Blue Mountains',
            'coordinates': [-80.4532732, 44.5620158],
            'country': 'CA',
            'neighborhood': 'Thornbury',
            'state': 'ON',
            'type': 'Point',
            'zip': 'N0H 2P0',
        }

        location = Location(gmaps_result)
        self.assertDictEqual(location.to_subdocument(), expected)

    def test_place_medium_details(self):
        """No zip, neighborhood
            from place/details/json?place_id=ChIJ2Y7LAInCzRIRkCuP_aUZCAQ&fields=address_component,formatted_address,geometry
            """
        gmaps_result = {
           "address_components": [
               {
                   "long_name": "Harrow",
                   "short_name": "Harrow",
                   "types": [
                       "locality",
                       "political"
                   ]
               },
               {
                   "long_name": "Greater London",
                   "short_name": "Greater London",
                   "types": [
                       "administrative_area_level_2",
                       "political"
                   ]
               },
               {
                   "long_name": "England",
                   "short_name": "England",
                   "types": [
                       "administrative_area_level_1",
                       "political"
                   ]
               },
               {
                   "long_name": "United Kingdom",
                   "short_name": "GB",
                   "types": [
                       "country",
                       "political"
                   ]
               }
           ],
           "formatted_address": "Harrow, UK",
           "geometry": {
               "location": {
                   "lat": 51.580559,
                   "lng": -0.3419949999999999
               }
           }
        }
        expected = {
            'address': 'Harrow, UK',
            'city': 'Harrow',
            'coordinates': [-0.3419949999999999, 51.580559],
            'country': 'GB',
            'state': 'England',
            'type': 'Point'
        }

        location = Location(gmaps_result)
        self.assertDictEqual(location.to_subdocument(), expected)

    def test_place_minimal_details(self):
        """No zip, neighborhood, state
            from place/details/json?\
            place_id=ChIJ2Y7LAInCzRIRkCuP_aUZCAQ
            fields=address_component,formatted_address,geometry"""
        gmaps_result = {
           'address_components': [
               {
                   'long_name': 'Monaco City',
                   'short_name': 'Monaco City',
                   'types': [
                       'sublocality_level_1',
                       'sublocality',
                       'political'
                   ]
               },
               {
                   'long_name': 'Monaco',
                   'short_name': 'Monaco',
                   'types': [
                       'locality',
                       'political'
                   ]
               },
               {
                   'long_name': 'Monaco',
                   'short_name': 'MC',
                   'types': [
                       'country',
                       'political'
                   ]
               }
           ],
           'formatted_address': 'Monaco City, Monaco',
           'geometry': {
               'location': {
                   'lat': 43.7308084,
                   'lng': 7.4225881
               }
           }
        }

        expected = {
            'address': 'Monaco City, Monaco',
            'city': 'Monaco',
            'coordinates': [7.4225881, 43.7308084],
            'country': 'MC',
            'type': 'Point'
        }

        location = Location(gmaps_result)
        self.assertDictEqual(location.to_subdocument(), expected)

    def test_place_no_locality(self):
        """No component with 'locality' for city, use 'postal_town' instead (edge case - this is route)
            from place/details/json?\
            place_id=ChIJH0KgOTYTdkgRYjcfqlxBg74
            fields=address_component,formatted_address,geometry"""
        gmaps_result = {
            'address_components': [
                {
                    'long_name': '226-212',
                    'short_name': '226-212',
                    'types': [
                        'street_number'
                    ]
                },
                {
                    'long_name': 'Imperial Drive',
                    'short_name': 'A4090',
                    'types': [
                        'route'
                    ]
                },
                {
                    'long_name': 'Rayners Lane',
                    'short_name': 'Rayners Lane',
                    'types': [
                        'sublocality_level_1',
                        'sublocality',
                        'political'
                    ]
                },
                {
                    'long_name': 'Harrow',
                    'short_name': 'Harrow',
                    'types': [
                        'postal_town'
                    ]
                },
                {
                    'long_name': 'Greater London',
                    'short_name': 'Greater London',
                    'types': [
                        'administrative_area_level_2',
                        'political'
                    ]
                },
                {
                    'long_name': 'England',
                    'short_name': 'England',
                    'types': [
                        'administrative_area_level_1',
                        'political'
                    ]
                },
                {
                    'long_name': 'United Kingdom',
                    'short_name': 'GB',
                    'types': [
                        'country',
                        'political'
                    ]
                },
                {
                    'long_name': 'HA2 7JW',
                    'short_name': 'HA2 7JW',
                    'types': [
                        'postal_code'
                    ]
                }
            ],
            'formatted_address': '226-212 A4090, Rayners Lane, Harrow HA2 7JW, UK',
            'geometry': {
                'location': {
                    'lat': 51.5764592,
                    'lng': -0.3696955000000001
                }
            }
        }

        expected = {
            'address': '226-212 A4090, Rayners Lane, Harrow HA2 7JW, UK',
            'coordinates': [-0.3696955000000001, 51.5764592],
            'city': 'Harrow',
            'country': 'GB',
            'state': 'England',
            'zip': 'HA2 7JW',
            'type': 'Point'
        }

        location = Location(gmaps_result)
        self.assertDictEqual(location.to_subdocument(), expected)


if __name__ == '__main__':
    unittest.main()
