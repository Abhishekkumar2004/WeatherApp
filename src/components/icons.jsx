import React from "react";
import windIcon from "../assets/Wind.png";
import humidityIcon from "../assets/Humidity.png";
import visibilityIcon from "../assets/Visibility.png";
import sunriseIcon from "../assets/Sunrise.png";
import sunsetIcon from "../assets/Sunset.png";

// Reusable Icon component
const Icon = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={`w-8 h-8 inline-block ${className}`} />
);

// Individual icon components
export const WindIcon = () => (
  <Icon src={windIcon} alt="Wind Icon" className="animate-icon svg-hover" />
);

export const HumidityIcon = () => (
  <Icon
    src={humidityIcon}
    alt="Humidity Icon"
    className="powerful-pulse svg-hover"
  />
);

export const VisibilityIcon = () => (
  <Icon
    src={visibilityIcon}
    alt="Visibility Icon"
    className="animate-icon svg-hover"
  />
);

export const SunriseIcon = () => (
  <Icon
    src={sunriseIcon}
    alt="Sunrise Icon"
    className="animate-icon svg-hover"
  />
);

export const SunsetIcon = () => (
  <Icon
    src={sunsetIcon}
    alt="Sunset Icon"
    className="powerful-pulse svg-hover"
  />
);
