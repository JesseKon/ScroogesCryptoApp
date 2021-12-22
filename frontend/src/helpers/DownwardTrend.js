/**
 * Find the longest downward trend among given data
 */

export const GetLongestDownwardTrend = (data) => {
  let downwardTrend = {
    startDate: data[0].date,
    endDate: "",
    duration: -1  // Do not count the first day
  };

  let downwardTrends = [];
  let currentPrice = Infinity;

  data.forEach(element => {

    // Trend ongoing
    if (element.price < currentPrice) {
      currentPrice = element.price;
      downwardTrend.endDate = element.date;
      ++downwardTrend.duration;
    }

    // Trend ended
    else {
      downwardTrends.push({
        startDate: downwardTrend.startDate,
        endDate: downwardTrend.endDate, 
        duration: downwardTrend.duration
      });

      downwardTrend.startDate = element.date;
      downwardTrend.endDate = "";
      downwardTrend.duration = 0;
      currentPrice = Infinity;
    }
  })

  // Save the last trend
  downwardTrends.push({
    startDate: downwardTrend.startDate,
    endDate: downwardTrend.endDate, 
    duration: downwardTrend.duration
  });   

  // Find the longest downward trend among them
  let longestTrendIndex = 0;
  for (let i = 0; i < downwardTrends.length; ++i) {
    if (downwardTrends[i].duration > downwardTrends[longestTrendIndex].duration) {
      longestTrendIndex = i;
    }
  }

  return downwardTrends[longestTrendIndex];
}
