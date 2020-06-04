import sys, os
import traceback
from flask import Flask, flash, redirect, render_template, request, session, abort, send_from_directory, jsonify, \
    Response
from flask_cors import CORS
import googlemaps
from dotenv import load_dotenv
from models.location import Location
from helpers import is_uuid_v4

load_dotenv()

# constants
PLACES_FIELDS = ['address_component', 'formatted_address', 'geometry/location']
AUTOCOMPLETE_TYPES = 'geocode'

app = Flask(__name__)
CORS(app)

gmaps = googlemaps.Client(key=os.getenv('GOOGLE_MAPS_API_KEY'))


@app.route('/reverse-geocode')
def reverse_geocode():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    if lat is None or lng is None:
        return jsonify(error="Please provide coordinates ({lat, lng}!", result="failed"), 400
    try:
        coordinates = (float(lat), float(lng))
        results = gmaps.reverse_geocode(coordinates)
        result = results[0]  # TODO: consider limiting types so fewer (only relevant) results
        location = Location(result)  # consider restricting types
        data = {'original': result, 'location': location.to_subdocument()}
        return jsonify(data=data, result="success"), 200
    except:
        app.logger.error(traceback.print_exc())
        return jsonify(error="Error getting the location details", result="failed"), 500


@app.route('/autocomplete')
def autocomplete():
    session_token = request.args.get('sessiontoken')
    input_text = request.args.get('input')
    if input_text is None or len(input_text) < 3:
        return jsonify(error="Please provide input of at least 3 characters", result="failed"), 400
    elif not is_uuid_v4(session_token):
        # always want a session token with autocomplete to reduce costs
        # see: https://developers.google.com/maps/billing/gmp-billing#ac-with-details-session
        return jsonify(error="Please provide a sessiontoken with valid UUID V4 format", result="failed"), 400
    try:
        results = gmaps.places_autocomplete(input_text, session_token, types=AUTOCOMPLETE_TYPES)
        return jsonify(data=results, result="success"), 200
    except:
        app.logger.error(traceback.print_exc())
        return jsonify(error="Error getting address autocomplete list", result="failed"), 500


@app.route('/place-details')
def place_details():
    session_token = request.args.get('sessiontoken')
    place_id = request.args.get('place')
    if place_id is None:
        return jsonify(error="Please provide a place identifier, e.g. place=ChIJuU2ptu90KogRjN6c01WqmLg",
                       result="failed"), 400
    elif not (session_token is None or is_uuid_v4(session_token)):
        # can use place-details without session token
        # but when autocomplete is used it should be there (reliant on client)
        return jsonify(error="The sessiontoken should be in valid UUID V4 format", result="failed"), 400
    try:
        result = gmaps.place(place_id, session_token, PLACES_FIELDS)
        location = Location(result['result'])
        data = {'original': result['result'], 'location': location.to_subdocument()}
        return jsonify(data=data, result="success"), 200
    except:
        # app.logger.error(("Unexpected error:", sys.exc_info()[0]))
        app.logger.error(traceback.print_exc())
        return jsonify(error="Error getting place details", result="failed"), 500


@app.route('/healthz')
def healthz():
    return "OK", 200


if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['PROPAGATE_EXCEPTIONS'] = True
    app.run(host="0.0.0.0", port=5000)
