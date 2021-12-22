/**
 * 
 * @param {*} data 
 * @returns 
 */

export const GetLongestDownwardTrend = (data) => {

  // Find all downward trends
  let downwardTrend = {
    startDate: "",
    endDate: "",
    duration: -1  // Do not count the current day
  };

  let downwardTrends = [];

  let currentPrice = Infinity;
  let currentlyDownwardTrending = false;

  data.forEach(element => {

    // Trend ongoing
    if (element.price < currentPrice) {
      currentPrice = element.price;

      if (!currentlyDownwardTrending) {
        downwardTrend.startDate = element.date;
        currentlyDownwardTrending = true;
      }

      downwardTrend.endDate = element.date;
      ++downwardTrend.duration;
    }

    // Trend ended
    else {
      console.log(downwardTrend);
      downwardTrends.push({
        startDate: downwardTrend.startDate,
        endDate: downwardTrend.endDate, 
        duration: downwardTrend.duration
      });

      downwardTrend.startDate = element.date;
      downwardTrend.endDate = "";
      downwardTrend.duration = -1;
      currentPrice = Infinity;
      currentlyDownwardTrending = false;
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
