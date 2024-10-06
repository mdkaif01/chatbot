# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

class ActionTellAJoke(Action):

    def name(self) -> str:
        return "action_tell_a_joke"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict) -> list:

        response = requests.get('https://official-joke-api.appspot.com/random_joke')
        if response.status_code == 200:
            joke = response.json()
            setup = joke['setup']
            punchline = joke['punchline']
            dispatcher.utter_message(text=setup)
            dispatcher.utter_message(text=punchline)
        else:
            dispatcher.utter_message(text="Sorry, I couldn't find a joke for you right now.")

        return []



import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

class ActionWeather(Action):

    def name(self) -> str:
        return "action_weather"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict) -> list:

        # Get the city from the slot
        city = tracker.get_slot('city')

        # If no city is provided, ask the user for one
        if not city:
            dispatcher.utter_message(text="Please provide the city you'd like to know the weather for.")
            return []

        # OpenWeatherMap API Key
        api_key = "50a17654a8923527c60cd02d6574cb9c"

        # API request URL
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

        # Make API request
        response = requests.get(url)

        # Check if the API response is successful
        if response.status_code == 200:
            data = response.json()
            temperature = data['main']['temp']
            description = data['weather'][0]['description']
            city_name = data['name']

            weather_info = f"The current temperature in {city_name} is {temperature}°C with {description}."
            dispatcher.utter_message(text=weather_info)
        else:
            dispatcher.utter_message(text="Sorry, I couldn't fetch the weather details. Please try again.")
        
        # Reset the city slot after providing the weather information
        return [SlotSet("city", None)]

