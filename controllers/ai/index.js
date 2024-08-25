const { azureBotResponsePredictScore, azureBotResponseSummarizeLink, azureBotResponseSummarizeCountries } = require('../../lib/azure_openai')


function summarizeDeviceUsage(data) {
  // Initialize an empty array to hold the result
  const results = [];

  // Loop through each country's data
  data.forEach(entry => {
    const { country, devices } = entry;
    // Sum up the device counts for the current country
    let totalDevice = 0;
    for (const count of Object.values(devices)) {
      totalDevice += count;
    }
    // Store the result in the results array
    results.push({ country, totalDevice });
  });

  // Return the array of results
  return results;
}

const getScoreSalesPage = async (req, res) => {
    const { totalreach, pageClicks, pageViews, engagement } = req.body;

    try {
  
      // console.log(information);
      const responseFromBot = await azureBotResponsePredictScore(totalreach, pageClicks, pageViews, engagement)
      return res.status(200).json({ success: true, data: responseFromBot });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, data: "Something went wrong" });
    }
}

const getSummarizeSalesPage = async (req, res) => {
  const { topPerformingCountries, topPerformingLinks, pageClicks, pageViews, engagement } = req.body;

  try {
    // Call the function and store its output
    const outputCountries = summarizeDeviceUsage(topPerformingCountries);

    const responseFromBotLink = await azureBotResponseSummarizeLink(topPerformingLinks);

    const responseFromBotCountries = await azureBotResponseSummarizeCountries(outputCountries);

    const responseFromPerformance = await azureBotResponsePredictScore(0, pageClicks, pageViews, engagement)

    return res.status(200).json({ success: true, data: { countrySummary: responseFromBotCountries, linkSummary: responseFromBotLink, performanceSumaary: responseFromPerformance } });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: "Something went wrong" });
  }
}

module.exports = {
    getScoreSalesPage,
    getSummarizeSalesPage
}