# Geo Service

Using googlemaps to get structured location for geolocation based filtering.

The primary feature leveraged is [Autocomplete with Places Detail](https://developers.google.com/maps/billing/gmp-billing#ac-no-details-session)

## Tests

* Unit tests are done on classes & functions not dependent on calling Google API
* We are not testing end-to-end with Google API, if issues are found due to for unanticipated edge cases these should be fixed and added as extra test case
* Add to `tests/` folder using `unittest` module, one `test_*` file per code file
* Use the command `python -m unittest tests/tests_*` to run the tests

## Usage

### Address Autocomplete

* The client should generate a UUID V4 session token to use for getting multiple addresses while typing to limit costs
* The client should send /autocomplete?token=TOKEN&input=ADDRESS_GUESS_INPUT
* The address guess input needs to be at least 3 characters
* A list of addresses is returned, the user then selects it

### Place Details

* The client should send the same generated UUID V4 session token during autocomplete once selected
* The client should send the selected addresses `place_id`

## Running Locally With Docker

You can use the Dockerfile.dev to build an image yourself, or make use of the docker-compose.yml file in the repository root to run this service with all others.

## Running Locally Without Docker

Use Python 3.7, install requirements (you might want to use a virtualenv) using `pip install -r requirements.txt`.

Run the app with `python app.py`. You should see okay when you navigate to [localhost:5000/healthz](http://localhost:5000/healthz)

## Notes

To make the handling of the requirements.txt more convenient, and easier to upgrade in the future, [pip-tools](https://github.com/jazzband/pip-tools) should be used.

You can update dependencies using `pip-compile`, or add new ones by adding lines to the requirements.in file.

## TODOs

A few non-essential things which are missing:

[x] Tests would be cool
[ ] Linting is love
[ ] Maybe consider using sentry to handle exceptions in production
