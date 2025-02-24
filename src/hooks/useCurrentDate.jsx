import { useState, useEffect } from 'react';

const useCurrentDate = () => {
  const [currentDate, setCurrentDate] = useState({
    day: '',
    time: '',
  });

  useEffect(() => {
    const formatDate = () => {
      const date = new Date();
      setCurrentDate({
        day: new Intl.DateTimeFormat(navigator.language, {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
        }).format(date),
        time: new Intl.DateTimeFormat(navigator.language, {
          hour: '2-digit',
          minute: '2-digit',
        }).format(date),
      });
    };

    formatDate();
    const interval = setInterval(formatDate, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return currentDate;
};

export default useCurrentDate;
