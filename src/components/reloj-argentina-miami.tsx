"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Clock } from "lucide-react";

const TimeInput = ({ value, onChange, isDarkMode, label }: any) => (
  <div className="relative">
    <Input
      type="time"
      value={value}
      onChange={onChange}
      className={`w-32 pl-8 pr-2 py-1 border rounded-md text-base ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 text-white"
          : "bg-white border-gray-300 text-black"
      }`}
      aria-label={label}
    />
    <Clock
      className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
        isDarkMode ? "text-gray-400" : "text-gray-500"
      }`}
    />
  </div>
);

export function RelojArgentinaMiami() {
  const [time, setTime] = useState(new Date());
  const [miamiTime, setMiamiTime] = useState("");
  const [argentinaTime, setArgentinaTime] = useState("");
  const [convertedTime, setConvertedTime] = useState("");
  const [isArgentinaToMiami, setIsArgentinaToMiami] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (timezone: string) => {
    return new Intl.DateTimeFormat("es-AR", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
      .format(time)
      .replace(/\s/g, "")
      .toLowerCase();
  };

  const formatDate = (timezone: string) => {
    return new Intl.DateTimeFormat("es-AR", {
      timeZone: timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(time);
  };

  const getWeekNumber = (date: Date) => {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  const TimeDisplay = ({
    country,
    timezone,
  }: {
    country: string;
    timezone: string;
  }) => (
    <div className="mb-16 last:mb-0 text-center">
      <h2 className="text-lg sm:text-xl font-normal mb-2">
        La hora actual en {country} es
      </h2>
      <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2">
        {formatTime(timezone)}
      </p>
      <p className="text-base sm:text-lg md:text-xl font-normal">
        {formatDate(timezone)}, Semana {getWeekNumber(time)}
      </p>
    </div>
  );

  const convertTime = () => {
    if (isArgentinaToMiami) {
      if (argentinaTime) {
        const [hours, minutes] = argentinaTime.split(":").map(Number);
        const argentinaDate = new Date();
        argentinaDate.setHours(hours, minutes, 0, 0);

        const miamiDate = new Date(argentinaDate.getTime() - 60 * 60 * 1000); // Subtract 1 hour

        const miamiTimeFormatted = new Intl.DateTimeFormat("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(miamiDate);

        setConvertedTime(miamiTimeFormatted);
      }
    } else {
      if (miamiTime) {
        const [hours, minutes] = miamiTime.split(":").map(Number);
        const miamiDate = new Date();
        miamiDate.setHours(hours, minutes, 0, 0);

        const argentinaDate = new Date(miamiDate.getTime() + 60 * 60 * 1000); // Add 1 hour

        const argentinaTimeFormatted = new Intl.DateTimeFormat("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(argentinaDate);

        setConvertedTime(argentinaTimeFormatted);
      }
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsArgentinaToMiami(checked);
    setMiamiTime("");
    setArgentinaTime("");
    setConvertedTime("");
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center p-4 sm:p-8 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="w-full max-w-4xl">
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
            />
            <Moon className="h-4 w-4" />
          </div>
        </div>
        <TimeDisplay
          country="Argentina"
          timezone="America/Argentina/Buenos_Aires"
        />
        <TimeDisplay country="Miami" timezone="America/New_York" />

        <div className="mt-16 text-center">
          <h2 className="text-lg sm:text-xl font-normal mb-4">
            Convertir hora{" "}
            {isArgentinaToMiami ? "Argentina - Miami" : "Miami - Argentina"}
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="conversion-mode"
                checked={isArgentinaToMiami}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="conversion-mode">
                {isArgentinaToMiami ? "Argentina a Miami" : "Miami a Argentina"}
              </Label>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <TimeInput
              value={isArgentinaToMiami ? argentinaTime : miamiTime}
              onChange={(e: any) =>
                isArgentinaToMiami
                  ? setArgentinaTime(e.target.value)
                  : setMiamiTime(e.target.value)
              }
              isDarkMode={isDarkMode}
              label={`Hora en ${isArgentinaToMiami ? "Argentina" : "Miami"}`}
            />
            <Button
              onClick={convertTime}
              className={`px-4 py-1 rounded-md text-base transition-colors ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Convertir
            </Button>
          </div>
          {convertedTime && (
            <p className="mt-4 text-xl font-bold">
              Hora en {isArgentinaToMiami ? "Miami" : "Argentina"}:{" "}
              {convertedTime}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
