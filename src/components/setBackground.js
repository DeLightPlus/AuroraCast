const setBackground = (weatherData) => {

    console.log('bg',weatherData);  
    
    if(!weatherData) return

    const currentTime = new Date().getTime() / 1000;

    // const sunriseTime = weatherData.sys.sunrise + (weatherData.timezone * 1000);
    // const sunsetTime = weatherData.sys.sunset + (weatherData.timezone * 1000);
  
    // const morningStart = sunriseTime;
    // const morningEnd = sunriseTime + (3600 * 2); // 2 hours after sunrise
    // const afternoonStart = morningEnd;
    // const afternoonEnd = sunsetTime - (3600 * 2); // 2 hours before sunset
    // const eveningStart = afternoonEnd;
    // const eveningEnd = sunsetTime;
  
    // let backgroundImage = '';
  
    // if (currentTime >= morningStart && currentTime < morningEnd) {
    //   backgroundImage = 'morning';
    // } else if (currentTime >= afternoonStart && currentTime < afternoonEnd) {
    //   backgroundImage = 'afternoon';
    // } else if (currentTime >= eveningStart && currentTime < eveningEnd) {
    //   backgroundImage = 'evening';
    // } else if (currentTime >= eveningEnd || currentTime < morningStart) {
    //   backgroundImage = 'night';
    //   // https://cdn.pixabay.com/photo/2016/11/29/03/59/dark-1867202_640.jpg
    // }
  
    // // document.body.style.backgroundImage = `url(${backgroundImage}.jpg)`;
    // console.log('Good ', backgroundImage);
    
  };

  export default setBackground;