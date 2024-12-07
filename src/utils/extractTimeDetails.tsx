const extractTimeDetails = (date:Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    // Convert hours to 12-hour format
    const hour12 = hours % 12 || 12; // Use 12 instead of 0 for midnight
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    // Pad minutes with leading zero if needed
    const formattedMinutes = minutes.toString().padStart(2, '0');
  
    return {
      hour: Number(hour12),
      minute: Number(formattedMinutes),
      ampm,
    };
  };
  
  export default extractTimeDetails;