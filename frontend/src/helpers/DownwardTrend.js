/**
 * Find all downward trends among given data.
 * Downward trend means, that the currency's price is decreasing.
 */
const GetDownwardTrends = (data) => {
  let downwardTrends = [];
  let currentPrice = Infinity;

  // data.forEach(element => {
  //   console.log(element);
  // })

  let downwardTrend = {
    startDate: (data[0] ? data[0].date : ""),
    endDate: "",
    duration: -1  // Do not count the first day
  };

  data.forEach(element => {

    // Trend ongoing
    if (element.price < currentPrice) {
      currentPrice = element.price;
      downwardTrend.endDate = element.date;
      ++downwardTrend.duration;
    }

    // Trend ended, save it to the array
    else {
      downwardTrends.push({
        startDate: downwardTrend.startDate,
        endDate: downwardTrend.endDate, 
        duration: downwardTrend.duration
      });

      downwardTrend.startDate = element.date;
      downwardTrend.endDate = "";
      downwardTrend.duration = 0;
      currentPrice = element.price;
    }
  })

  // Save the last trend to the array
  downwardTrends.push({
    startDate: downwardTrend.startDate,
    endDate: downwardTrend.endDate, 
    duration: downwardTrend.duration
  });

  return downwardTrends;
}


/**
 * Find the longest downward trend (in days) among given data
 */
export const GetLongestDownwardTrend = (data) => {
  const downwardTrends = GetDownwardTrends(data);

  let longestTrendIndex = 0;
  for (let i = 0; i < downwardTrends.length; ++i) {
    if (downwardTrends[i].duration > downwardTrends[longestTrendIndex].duration) {
      longestTrendIndex = i;
    }
  }

  return downwardTrends[longestTrendIndex];
}
