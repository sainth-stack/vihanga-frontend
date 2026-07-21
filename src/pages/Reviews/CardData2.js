export const cardData2 = (totalWeights, setData) => {
  let totalWeightsData = {
    datasets: [{
      label: 'My First Dataset',
      data: [totalWeights, totalWeights > 0 ? 100 - totalWeights : 0],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'whitesmoke',
      ],
      hoverOffset: 4,
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    }]
  };
  setData(totalWeightsData);
  return null;
}
