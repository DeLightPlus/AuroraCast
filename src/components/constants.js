const weatherIcons = {
    '01d': '☀',   '01n': '🌙', // clear sky ☁⛅⛈🌤🌥🌦🌧🌧🌨🌩 	
    '02d': '🌤', '02n': '☁', // few clouds
    '03d': '🌤', '03n': '☁', // scattered clouds
    '04d': '🌤', '04n': '☁', // broken clouds 127781
    '09d': '🌦', '09n': '🌧', // shower rain
    '10d': '🌨', '10n': '🌨', // rain
    '11d': '⛈', '11n': '⛈', // thunderstom
    '13d': '❄',  '13n': '❄', // snow
    '50d': '🌫', '50n': '🌫' // mist
};
export default weatherIcons;

export const measure_units = { standard: 'standard', metric:'metric', imperial:'imperial' }