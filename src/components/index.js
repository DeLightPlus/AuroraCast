import axios from 'axios';

const api = 
{
  key: "895284fb2d2c50a520ea537456963d9c",
  base: "https://api.openweathermap.org/data/2.5"
}

export async function GetSetCurrent(latitude, longitude, tempUnits) 
{    
    console.log(tempUnits);
    const urlocation = ` ${api.base}/weather?lat=${latitude}&lon=${longitude}&units=${tempUnits}&appid=${api.key} `;

    return await axios.get(urlocation).then(response => 
        {
            try
            {
                if (response.data) 
                {     
                    localStorage.setItem('curLocationWeather', JSON.stringify(response.data)); 
                    console.log('curLocationWeather/udadate|data', response.data);
                     
                    
                    return response.data;                          
        
                } else { console.log('No results found');  }
            }
            catch (error) 
            {
                console.error('Error fetching current weather:', error);
                throw error;
            }

            
        }).catch(error => 
            {
                console.error('Error fetching the city name:', error);
                console.log('Error fetching the city name');
            });    
}

export default async function GetLocation(units) 
{    
    try
    {
        // Check if Geolocation is supported
        if (navigator.geolocation) 
        {
            navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
    
                return GetSetCurrent(latitude, longitude, units);                                              
            }, 

                error => {console.error('Error getting location:', error); }
            );
        } 
        else {   console.error("Geolocation is not supported by this browser.");   }   
    }
    catch (error) 
    {
        console.error('Error fetching current weather:', error);
        throw error;
    }     
}

export function getCurrentDate()
{
    const cur_date = { 
        day: new Intl.DateTimeFormat(navigator.language,
            { weekday:'short', day:'2-digit', month:'short' }
        ).format(new Date()),

        time: new Intl.DateTimeFormat(navigator.language,
            { hour: '2-digit', minute: '2-digit' }
        ).format(new Date()),
    };

    return cur_date;
}





