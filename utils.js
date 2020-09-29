const sections = ['أ', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ع', 'غ'];
const nationalities = ['أردني', 'عراقي', 'بنغلاديش', 'تركيا', 'مغربي', 'ألبانيا', 'سعودي', 'أروبا', 'الهند', 'فنزويلا', 'أوكرانيا', 'سوري', 'مصري', 'فلسطيني', 'إماراتي', 'يمني', 'السودان', 'افغاني', 'تونسي', 'لبناني', 'روسيا', 'البوسنة والهرسك', 'بحريني', 'بلغاريا', 'البرازيل', 'جزر القمر', 'إيران', 'كندا', 'جزائري', 'ألمانيا', 'أمريكا', 'اسبانيا', 'تشاد', 'القارة القطبية الجنوبية', 'المملكة المتحدة', 'كويتي', 'ليبي', 'فرنسا', 'اخرى/ بدون', 'أستراليا', 'قرغيزستان', 'الصين', 'غانا', 'نيجيريا', 'صومالي', 'يوغسلافيا', 'دومينيكا', 'السويد', 'سيريلانكا', 'هولندا', 'الدنمارك', 'النرويج', 'باكستاني', 'هندوراس', 'بلجيكا', 'قازاغستان', 'الفلبين', 'رومانيا', 'مالديف', 'السنغال', 'هندوراس', 'الإكوادور', 'نيبال', 'قطري', 'ماليزي', 'عماني', 'أريتريا', 'سويسرا', 'كوريا الجنوبية', 'إندونيسيا', 'إيطاليا', 'الأرجنتين', 'بنما', 'النمسا', 'الكونغو', 'كوريا الشما لية', 'دنمارك', 'أفريقيا الوسطى'];
const districts = [
  [3104, 'الاغوار الجنوبية'],
  [2105, 'الاغوار الشمالية'],
  [3304, 'البادية الجنوبية'],
  [2203, 'البادية الشمالية الشرقية'],
  [2202, 'البادية الشمالية الغربية'],
  [3302, 'البتراء'],
  [1106, 'الجيزة'],
  [1302, 'الرصيفة'],
  [2106, 'الرمثا'],
  [1301, 'الزرقاء الاولى'],
  [1303, 'الزرقاء الثانية'],
  [1201, 'السلط'],
  [3303, 'الشوبك'],
  [1203, 'الشونة الجنوبية'],
  [3201, 'الطفيلة'],
  [3401, 'العقبة'],
  [3103, 'القصر'],
  [2103, 'الكورة'],
  [3102, 'المزار الجنوبي'],
  [2109, 'المزار الشمالي'],
  [1107, 'الموقر'],
  [3202, 'بصيرا'],
  [2102, 'بني عبيد'],
  [2104, 'بني كنانة'],
  [2301, 'جرش'],
  [1202, 'دير علا'],
  [1402, 'ذيبان'],
  [2401, 'عجلون'],
  [1204, 'عين الباشا'],
  [2101, 'قصبة اربد'],
  [3101, 'قصبة الكرك'],
  [2201, 'قصبة المفرق'],
  [1101, 'قصبة عمان'],
  [3301, 'قصبة معان'],
  [1102, 'لواء الجامعة'],
  [1113, 'لواء القويسمة'],
  [1103, 'لواء سحاب'],
  [1104, 'لواء ماركا'],
  [1108, 'لواء وادي السير'],
  [2107, 'لوائي الطيبة والوسطية'],
  [1401, 'مادبا'],
  [4000, 'مديرية الاردن الافتراضية'],
  [6000, 'مديرية التعليم الخاص'],
  [1112, 'مديرية الثقافة العسكرية'],
  [1109, 'ناعور'],
  [5000, 'وكالة غوث اللاجئين - الاونروا']
]


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

const formatDate = (date) => {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('/');
}

const formatSection = (section) => {
  section = section.split('-').pop();
  section = section.trim();

  if(!sections.includes(section)) {
    if(section.includes(' ')) {
      section = section.split(' ').pop();
    }

    section = section.trim();

    if(section == 'هـ') {
      section = 'ه';
    }
  }
  
  // if(!sections.includes(section)) {
  //   console.log('section', section); // test
  // }

  return sections.includes(section) ? `'${section}'` : null;
}

const formatNationality = (nat) => {
  if(!nationalities.includes(nat)) {
    return null;
  }
1
  return `'${nat}'`;
}

const formatDistrict = (district) => {
  for (let i = 0; i < districts.length; i++) {
    const element = districts[i];
    if(element[1].trim() === district.trim())
      return element[0]; // ID
  }
  return null;
}

const formatGender = (gender) => {
  gender = gender.toLowerCase();
  return ['male', 'female'].includes(gender) ? gender : 'unknown';
}
  
module.exports = {
    getMethods,
    stringToDate,
    getFormatedDate,
    formatDate,
    formatSection,
    formatNationality,
    formatDistrict,
    formatGender,
};
