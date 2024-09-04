"use client";
// Import necessary hooks and types from React
import { useState, ChangeEvent, FormEvent } from "react";

// Import custom UI components from the UI directory
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Import icons from the Lucide React library
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}
export default function Weather() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  let handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedLocation = location.trim();
    if (location.trim() === "") {
      setError("Please enter a Valid location!");
      setWeather(null);
    }
    setIsLoading(true);
    setError(null);

    try {
      let response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );
      if (!response.ok) {
        throw new Error("city not found!");
      }
      let data = await response.json();
      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("city not found, Please try again!");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };
  let getTemperatureMessage = (temperature: number, unit: string): string => {
    if (unit === "C") {
      if (temperature < 0) {
        return `it's freexing at ${temperature}°C! Bundle up!`;
      } else if (temperature < 10) {
        return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
      } else if (temperature < 20) {
        return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
      } else if (temperature < 30) {
        return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`;
      } else {
        return `It's hot at ${temperature}°C. Stay hydrated!`;
      }
    } else {
      return `${temperature}°${unit}`;
    }
  };
  let getWeatherMessage = (description: string): string => {
    switch (description) {
      case "sunny":
        return "It's a beautiful sunny Day!";
        break;
      case "party cloudy":
        return "Expect some clouds and sunshine!";
        break;
      case "cloudy":
        return "It's cloudy today!";
        break;
      case "overcast":
        return "The sky is overcast!";
        break;
      case "rain":
        return "Don't forget your umbrella! It's raining.";
        break;
      case "thunderstorm":
        return "Thunderstorms are expected today!";
        break;
      case "snow":
        return "Bundle up! It's snowing";
        break;
      case "mist":
        return "It's misty outside.";
        break;
      case "fog":
        return "Be careful, there's fog outside.";
      default:
        return description;
        break;
    }
  };
  let getLocationMessage = (location: string): string => {
    const currentHour = new Date().getHours();
    const isNight = currentHour > 18 || currentHour < 6;

    return `${location} ${isNight ? "at Night" : "During the Day"}`;
  };
  return (
    <div className="flex justify-center items-center h-screen">
      {/* Center the card within the screen */}
      <Card className="w-full max-w-md mx-auto text-center">
        {/* Card header with title and description */}
        <CardHeader>
          <CardTitle>Weather Widget</CardTitle>
          <CardDescription>
            Search for the current weather conditions in your city.
          </CardDescription>
        </CardHeader>
        {/* Card content including the search form and weather display */}
        <CardContent>
          {/* Form to input and submit the location */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter a city name"
              value={location}
              onChange={
                (e: ChangeEvent<HTMLInputElement>) =>
                  setLocation(e.target.value) // Update location state on input change
              }
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Search"}{" "}
              {/* Show "Loading..." text while fetching data */}
            </Button>
          </form>
          {/* Display error message if any */}
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {/* Display weather data if available */}
          {weather && (
            <div className="mt-4 grid gap-2">
              {/* Display temperature message with icon */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <ThermometerIcon className="w-6 h-6" />
                  {getTemperatureMessage(weather.temperature, weather.unit)}
                </div>
              </div>
              {/* Display weather description message with icon */}
              <div className="flex items-center gap-2">
                <CloudIcon className="w-6 h-6 " />
                <div>{getWeatherMessage(weather.description)}</div>
              </div>
              {/* Display location message with icon */}
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 " />
                <div>{getLocationMessage(weather.location)}</div>
              </div>
              <h1 className="py-2">Made By Hassaan Arain</h1>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
