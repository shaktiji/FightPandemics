class Location:
    """ Takes Google Maps geocoded result & location schema required by FightPandemics data model.

    Args:
        gmaps_result (dict): The result as returned by Google Maps API geocode endpoints & place/details for geocoded place_id
            These two endpoints share the common attributes necessary to convert to FightPandemics data model:
            place/details: https://developers.google.com/places/web-service/details#PlaceDetailsResults
            geocode: https://developers.google.com/maps/documentation/geocoding/intro#Results"""
    # constants
    TYPE = 'Point'

    def __init__(self, gmaps_result):
        self._address_components = gmaps_result['address_components']
        self._geometry = gmaps_result['geometry']
        self._address = gmaps_result['formatted_address']

    def _parse_coordinates(self):
        # MongoDB requires in order [lng, lat]
        # See: https://docs.mongodb.com/manual/geospatial-queries/
        return [self._geometry['location']['lng'], self._geometry['location']['lat']]

    def _parse_neighborhood(self):
        return next((ac['short_name'] for ac in self._address_components if 'neighborhood' in ac['types']), None)

    def _parse_city(self):
        return next((ac['short_name'] for ac in self._address_components if ('postal_town' in ac['types']) or ('locality' in ac['types'])), None)

    def _parse_state(self):
        return next((ac['short_name'] for ac in self._address_components if 'administrative_area_level_1' in ac['types']), None)

    def _parse_country(self):
        return next((ac['short_name'] for ac in self._address_components if 'country' in ac['types']), None)

    def _parse_zip(self):
        return next((ac['short_name'] for ac in self._address_components if 'postal_code' in ac['types']), None)

    def to_subdocument(self):
        """ Converts to MongoDB subdocument as defined in Location schema

        Returns:
            dict: Location as subdocument format """

        subdocument = {
            'address': self._address,
            'coordinates': self._parse_coordinates(),
            'type': self.TYPE
        }
        neighborhood = self._parse_neighborhood()
        if neighborhood is not None:
            subdocument['neighborhood'] = neighborhood

        city = self._parse_city()
        if city is not None:
            subdocument['city'] = city

        state = self._parse_state()
        if state is not None:
            subdocument['state'] = state

        country = self._parse_country()
        if country is not None:
            subdocument['country'] = country

        zip_code = self._parse_zip()
        if zip_code is not None:
            subdocument['zip'] = zip_code

        return subdocument
