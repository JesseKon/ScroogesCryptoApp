

export const GetChartDataPoints = (data) => {
  let dataPoints = [];

  data.forEach(element => {
    dataPoints.push({
      date: element.date.slice(0, 10),
      price: element.price,
      total_volume: element.total_volume
    })
  });

  return dataPoints;
}