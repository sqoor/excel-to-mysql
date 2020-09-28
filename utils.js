const getMethods = (obj) => {
    let result = [];
    for (let id in obj) {
      try {
        if (typeof(obj[id]) == "function") {
          result.push(id + ": " + obj[id].toString());
        }
      } catch (err) {
        result.push(id + ": inaccessible");
      }
    }
    return result;
}

/**
 * Converts string to date
 * 
 * Examples 
 * stringToDate("17/9/2014","dd/MM/yyyy","/"); 
 * stringToDate("9/17/2014","mm/dd/yyyy","/") 
 * stringToDate("9-17-2014","mm-dd-yyyy","-")
 * 
 */
const stringToDate = (_date,_format,_delimiter) => {
  if(!_date ||!_format || !_delimiter) {
    throw Error('string to date function params (_date,_format,_delimiter) required');
  }

  var formatLowerCase=_format.toLowerCase();
  var formatItems=formatLowerCase.split(_delimiter);
  var dateItems=_date.split(_delimiter);
  var monthIndex=formatItems.indexOf("mm");
  var dayIndex=formatItems.indexOf("dd");
  var yearIndex=formatItems.indexOf("yyyy");
  var month=parseInt(dateItems[monthIndex]);
  month-=1;
  var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
  return formatedDate;
}

const getFormatedDate = (dateString) => {
  let date = new Date(dateString);

  // date = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`;
  if(date.getFullYear() === 0 || date.getMonth() === 0 || date.getDay() == 0)
    console.log('here', date)
  return date;
}
  
module.exports = {
    getMethods,
    stringToDate,
    getFormatedDate
};