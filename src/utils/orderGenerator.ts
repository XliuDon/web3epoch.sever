
// Generate order number
function generateOrderNumber(): string {
    const currentDate = new Date();

    // Format the date components
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    // Generate a random number between 10000 and 99999
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;

    // Combine the formatted date components and the random number
    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}${randomNumber}`;

  return formattedDate;
}

export default generateOrderNumber;
