"use client";
import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Country } from "../../types";
import { Input } from "../ui/Input";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useThemeStore } from "../../store/themeStore";

interface CountrySelectorProps {
  countries: Country[];
  loading: boolean;
  selectedCountry: Country | null;
  onSelect: (country: Country) => void;
}

export function CountrySelector({
  countries,
  loading,
  selectedCountry,
  onSelect,
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { isDark } = useThemeStore();

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDialCode = (country: Country) => {
    const suffix = country.idd.suffixes?.[0] || "";
    return `${country.idd.root}${suffix}`;
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-10 rounded-md px-3 border ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}
      >
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full h-10 px-3 py-2 text-sm rounded-md border 
        ${isDark ? 
          "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900 focus:ring-slate-300" :
          "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-950"
        }
        focus:outline-none focus:ring-2`}
      >
        {selectedCountry ? (
          <div className="flex items-center gap-2">
            <span>{selectedCountry.flag}</span>
            <span>{getDialCode(selectedCountry)}</span>
          </div>
        ) : (
          <span className={isDark ? "text-slate-400" : "text-slate-500"}>
            Select country
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-0 right-0 z-50 mt-1 rounded-md shadow-lg max-h-60 overflow-hidden border 
          ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}
        >
          <div
            className={`p-2 border-b ${
              isDark ? "border-slate-800" : "border-slate-200"
            }`}
          >
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-48">
            {filteredCountries.map((country) => (
              <button
                key={country.cca2}
                type="button"
                onClick={() => {
                  onSelect(country);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm text-left 
                ${isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-700"}`}
              >
                <span>{country.flag}</span>
                <span className="flex-1">{country.name.common}</span>
                <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                  {getDialCode(country)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
