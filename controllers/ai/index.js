const { azureBotResponsePredictScore } = require('../../lib/azure_openai')


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

module.exports = {
    getScoreSalesPage
}