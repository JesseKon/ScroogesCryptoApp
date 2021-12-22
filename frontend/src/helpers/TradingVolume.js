/**
 * Find the highest trading volume among given data
 */

export const GetHighestTradingVolume = (data) => {
  let highestTradingVolume = {
    date: "",
    volume: 0.0
  }
  
  data.forEach(element => {
    if (element.total_volume > highestTradingVolume.volume) {
      highestTradingVolume.date = element.date.slice(0, 10);
      highestTradingVolume.volume = element.total_volume;
    }
  });

  return highestTradingVolume;
}
