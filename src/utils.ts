export const signTranslations : ISignTranslations = {
  Aries: 'Aries',
  Taurus: 'Tauro',
  Gemini: 'Géminis',
  Cancer: 'Cáncer',
  Leo: 'Leo',
  Virgo: 'Virgo',
  Libra: 'Libra',
  Scorpio: 'Escorpio',
  Sagittarius: 'Sagitario',
  Capricorn: 'Capricornio',
  Aquarius: 'Acuario',
  Pisces: 'Piscis',
};


export function calcularSigno(date: string):string {
  const [, mes, dia] = date.split("-")
  const day = Number(dia)
  const month = Number(mes)
  console.log({ day, month });


  const ranges = [
    { start: { month: 3, day: 21 }, end: { month: 4, day: 20 }, name: 'Aries' },
    { start: { month: 4, day: 21 }, end: { month: 5, day: 21 }, name: 'Taurus' },
    { start: { month: 5, day: 22 }, end: { month: 6, day: 21 }, name: 'Gemini' },
    { start: { month: 6, day: 22 }, end: { month: 7, day: 23 }, name: 'Cancer' },
    { start: { month: 7, day: 24 }, end: { month: 8, day: 23 }, name: 'Leo' },
    { start: { month: 8, day: 24 }, end: { month: 9, day: 23 }, name: 'Virgo' },
    { start: { month: 9, day: 24 }, end: { month: 10, day: 23 }, name: 'Libra' },
    { start: { month: 10, day: 24 }, end: { month: 11, day: 22 }, name: 'Scorpio' },
    { start: { month: 11, day: 23 }, end: { month: 12, day: 21 }, name: 'Sagittarius' },
    { start: { month: 12, day: 22 }, end: { month: 1, day: 20 }, name: 'Capricorn' },
    { start: { month: 1, day: 21 }, end: { month: 2, day: 19 }, name: 'Aquarius' },
    { start: { month: 2, day: 20 }, end: { month: 3, day: 20 }, name: 'Pisces' },
  ];

  for (const range of ranges) {
    if (
      (month > range.start.month || (month === range.start.month && day >= range.start.day)) &&
      (month < range.end.month || (month === range.end.month && day <= range.end.day))
    ) {
      const sign = range.name
      return sign
    }
  }

  return 'Sin rango';


}

export async function getHoroscopo(signo: string) : Promise<IHoroscopo>{
  signo = signo.toLocaleLowerCase()
  const dailyFetch = fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${signo}&day=today`)
  const weeklyFetch = fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/weekly?sign=${signo}`)
  const monthlyFetch = fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/monthly?sign=${signo}`)
  const [daily,weekly,monthly] = await Promise.all([dailyFetch,weeklyFetch,monthlyFetch])
  
  const dailyData = await daily.json()
  const weeklyData = await weekly.json()
  const monthlyData = await monthly.json()

  // const dailyText = await translate(dailyData.data.horoscope_data)
  // const weeklyText = await translate(weeklyData.data.horoscope_data)
  // const monthlyText = await translate(monthlyData.data.horoscope_data)
  const dailyText = dailyData.data.horoscope_data
  const weeklyText = weeklyData.data.horoscope_data
  const monthlyText = monthlyData.data.horoscope_data


  return {
    daily:dailyText,
    weekly:weeklyText,
    monthly:monthlyText,
  }

}

async function translate(text : string) : Promise<string>{
  const textParts : string[] = splitText(text)
  let finalText = ""
  for (const text of textParts) {
    const response = await  fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=en|es`)
  const data = await response.json()
  finalText += " "+  data.responseData.translatedText
  }
  if (finalText){
    return finalText
  }else{
    return ""
  }
}

function splitText(text : string) : string[]{
  const MAX_LENGTH = 500;
  const chunks = [];
  
  while (text.length > 0) {
    if (text.length <= MAX_LENGTH) {
      chunks.push(text);
      break;
    } else {
      const chunk = text.substring(0, MAX_LENGTH);
      const lastSpaceIndex = chunk.lastIndexOf(' ');
      const truncatedChunk = lastSpaceIndex !== -1 ? chunk.substring(0, lastSpaceIndex) : chunk;
      chunks.push(truncatedChunk);
      text = text.substring(truncatedChunk.length).trim();
    }
  }
  
  return chunks;
}

export interface IHoroscopo {
  daily: string,
  weekly: string,
  monthly: string
}

export interface ISignTranslations {
  [key: string]: string
}

