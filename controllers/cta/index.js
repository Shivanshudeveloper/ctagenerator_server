const Cta_Model = require("../../models/Cta");
const CtaCounter_Model = require("../../models/CtaCounter");
const ClicksCta_Model = require("../../models/StatsCta");
const VideoViews_Model = require("../../models/VideoViews");
const CtaContacts_Model = require("../../models/CtaContacts");
const { v4: uuidv4 } = require("uuid");

const createCta = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const submitrequest = req.body;
  const ctaUid = `${Date.now()}_${uuidv4()}`;

  const counter = await CtaCounter_Model.findByIdAndUpdate(
    "ctaId",
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );

  try {
    const newCta = new Cta_Model({
      organizationId: submitrequest.organizationId,
      userEmail: submitrequest.userEmail,
      typecta: submitrequest.typecta,
      title: submitrequest.title,
      ctaPublicId: counter.sequence_value,
      ctaUid,
      status: 1,
    });

    const resdata = await newCta.save();
    console.log(resdata);
    return res.status(200).json({ status: true, data: resdata });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, data: "Error while creating Project" });
  }
};

// Get CTA by Public ID
const getCtabyPublicId = async (req, res) => {
  const { ctaPublicId } = req.params;
  try {
    Cta_Model.findOne({ ctaPublicId })
      .then((data) => {
        res.status(200).json({ status: true, data });
      })
      .catch((err) => console.log(err));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete CTA by MongoDB UID
const deleteCta = async (req, res) => {
  const { ctaPublicId } = req.params;

  try {
    Cta_Model.findOneAndDelete({ ctaPublicId })
      .then((data) => {
        res.status(200).json({ status: true, data });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .json({ status: false, data: "Something went wrong" });
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, data: "Something went wrong" });
  }
};

// Get User CTA
const getCtaforUser = async (req, res) => {
  const { organizationId } = req.params;
  try {
    Cta_Model.find({ organizationId })
      .sort({ createdAt: -1 })
      .then((data) => {
        res.status(200).json({ status: true, data });
      })
      .catch((err) => console.log(err));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateVideoViewCount = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    const { ctaPublicId, userIpAddress } = req.body;
    console.log("video count is being updated");
    const videoView = await VideoViews_Model.findOne({
      ctaPublicId,
      userIpAddress,
    });
    if (videoView) {
      return res
        .status(500)
        .json({ success: false, data: "video view already exists" });
    }
    const newVideoView = new VideoViews_Model({
      ctaPublicId,
      userIpAddress,
    });
    await newVideoView.save();
    return res
      .status(200)
      .json({ message: "video view is saved", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
};

const getVideoViewCount = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { ctaPublicId } = req.params;
  try {
    const counts = await VideoViews_Model.countDocuments({ ctaPublicId });
    return res.status(200).json({ success: true, data: counts });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
};

const getCtaContacts = async (req, res) => {
  try {
    const { ctaPublicId } = req.params;
    const ctaContacts = await CtaContacts_Model.find({ ctaPublicId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: ctaContacts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
}

const saveCtaContact = async (req, res) => {
  try {
    const { ctaPublicId, firstName, lastName, email } = req.body;
    const newCtaContact = new CtaContacts_Model({
      ctaPublicId,
      firstName,
      lastName,
      email,
    });
    const savedCtaContact = await newCtaContact.save();
    return res.status(200).json({ success: true, data: savedCtaContact });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
}

const saveTotalTimeSpent = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const {
    fieldToUpdate,
    userIpAddress,
    userLocation,
    userBrowser,
    userDevice,
    totalTimeSpent,
    ctaPublicId,
  } = req.body;
  newCtaStat = new ClicksCta_Model({
    clickType:
      fieldToUpdate === "linkClicksCount"
        ? "link"
        : fieldToUpdate === "viewCount"
        ? "view"
        : fieldToUpdate === "video"
        ? "video"
        : "totalTimeSpent",
    userIpAddress,
    userLocation,
    userBrowser,
    userDevice,
    ctaPublicId,
    totalTimeSpent,
  });
  const alreadyExists = await ClicksCta_Model.findOne({
    ctaPublicId,
    userIpAddress,
    clickType: "totalTimeSpent",
  });
  if(alreadyExists) return res.status(500).json({ success: false, data: "user already exists" });
  newCtaStat
    .save()
    .then((data) => {
      console.log(data);
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, data: "Something went wrong" });
    });
};
const saveVideoStats = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const {
    fieldToUpdate,
    userIpAddress,
    userLocation,
    userBrowser,
    userDevice,
    videoStats,
    ctaPublicId,
  } = req.body;
  console.log(req.body);
  const data = await Cta_Model.updateOne(
    { ctaPublicId },
    { $inc: { [fieldToUpdate]: 1 } }
  );
  if (!data) {
    console.log("Something went wrong");
    return res
      .status(500)
      .json({ status: false, data: "Something went wrong" });
  }
  const userClicks = await ClicksCta_Model.findOne({
    ctaPublicId,
    userIpAddress,
    clickType:
      fieldToUpdate === "linkClicksCount"
        ? "link"
        : fieldToUpdate === "viewCount"
        ? "view"
        : "video",
  });
  
  if (userClicks)
    return res.status(500).json({ status: false, data: "user already exists" });


  const currentCta = await Cta_Model.findOne({ ctaPublicId });
  const newUserClicks = new ClicksCta_Model({
    userIpAddress,
    userLocation,
    userBrowser,
    userDevice,
    ctaUid: currentCta._id,
    clickType:
      fieldToUpdate === "linkClicksCount"
        ? "link"
        : fieldToUpdate === "viewCount"
        ? "view"
        : "video",
    ctaPublicId,
    videoStats,
    ctaClientEmail: currentCta.userEmail,
  });
  const savedUserClicks = await newUserClicks.save();

  return res.status(200).json({ status: true, data: savedUserClicks });
};

const getCtaClicksLogs = async (req, res) => {
  const { ctaPublicId } = req.params;
  try {
    ClicksCta_Model.find({ ctaPublicId })
      .sort({ createdAt: -1 })
      .then((data) => {
        res.status(200).json({ status: true, data });
      })
      .catch((err) => console.log(err));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllCtaClickStats = async (req, res) => {
  const { organizationId } = req.params;
  try {
    const allCtas = await Cta_Model.find({ organizationId });
    let result = {};

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 9); // Set startDate to 9 days before endDate

    // Helper function to format date to 'YYYY-MM-DD'
    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    // Create an array of dates from startDate to endDate
    const datesArray = [];
    for (let i = 0; i < 10; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      datesArray.push(formatDate(currentDate));
    }

    for (let i = 0; i < allCtas.length; i++) {
      const cta = allCtas[i];

      const resultView = await ClicksCta_Model.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
            clickType: "link",
            ctaPublicId: parseInt(cta.ctaPublicId),
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            total_clicks: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            total_clicks: 1,
            _id: 0,
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ]);

      // Initialize an array of length 10 with 0s
      const clicksArray = new Array(10).fill(0);

      // Populate the clicksArray based on the resultView
      resultView.forEach((item) => {
        const index = datesArray.indexOf(item.date);
        if (index !== -1) {
          clicksArray[index] = item.total_clicks;
        }
      });

      result[cta.ctaPublicId] = clicksArray;
    }
    res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get All CTA
const getAllCtaInSystem = async (req, res) => {
  try {
    Cta_Model.find({})
      .sort({ date: -1 })
      .then((data) => {
        res.status(200).json({ status: true, data });
      })
      .catch((err) => console.log(err));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update CTA Details
const updateCtaDetails = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const submitrequest = req.body;
  console.log("hi updateCtaDetails");
  Cta_Model.updateOne(
    { ctaPublicId: submitrequest?.ctaPublicId },
    { $set: submitrequest.data }
  )
    .then((data) => {
      res.status(200).json({ status: true, data });
    })
    .catch((err) => console.log(err));
};

const updateCtaCounts = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { ctaPublicId } = req.params;
  const {
    fieldToUpdate,
    userIpAddress,
    userLocation,
    userBrowser,
    userDevice,
  } = req.body;

  const data = await Cta_Model.updateOne(
    { ctaPublicId },
    { $inc: { [fieldToUpdate]: 1 } }
  );
  if (!data) {
    return res
      .status(500)
      .json({ status: false, data: "Something went wrong" });
  }
  const userClicks = await ClicksCta_Model.findOne({
    ctaPublicId,
    userIpAddress,
    clickType:
      fieldToUpdate === "linkClicksCount"
        ? "link"
        : fieldToUpdate === "viewCount"
        ? "view"
        : "video",
  });
  if (userClicks)
    return res.status(500).json({ status: false, data: "user already exists" });
  const currentCta = await Cta_Model.findOne({ ctaPublicId });
  const newUserClicks = new ClicksCta_Model({
    userIpAddress,
    userLocation,
    userBrowser,
    userDevice,
    ctaUid: currentCta._id,
    clickType:
      fieldToUpdate === "linkClicksCount"
        ? "link"
        : fieldToUpdate === "viewCount"
        ? "view"
        : "video",
    ctaPublicId,
    ctaClientEmail: currentCta.userEmail,
  });
  const savedUserClicks = await newUserClicks.save();

  return res.status(200).json({ status: true, data: savedUserClicks });
};

const getCtaClicksDetails = async (req, res) => {
  const { ctaPublicId } = req.params;
  const { startDate, endDate } = req.body;

  console.log(ctaPublicId);
  console.log(startDate, endDate);
  console.log(startDate, endDate);
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Set the end date to the end of the day

  // Helper function to format date to 'YYYY-MM-DD'
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  dateDifference = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  // Create an array of dates from startDate to endDate
  const datesArray = [];
  const tempDate = new Date(start);
  let tomorrowDate = new Date(endDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  while (
    tempDate.toISOString().split("T")[0] !=
    tomorrowDate.toISOString().split("T")[0]
  ) {
    datesArray.push(tempDate.toISOString().split("T")[0]);
    tempDate.setDate(tempDate.getDate() + 1);
  }

  console.log(dateDifference);
  console.log(start);
  console.log(end);
  try {
    const resultView = await ClicksCta_Model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
          clickType: "view",
          ctaPublicId: parseInt(ctaPublicId),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total_clicks: { $sum: 1 },
        },
      },
      {
        $project: {
          date: "$_id",
          total_clicks: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    const resultLink = await ClicksCta_Model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
          clickType: "link",
          ctaPublicId: parseInt(ctaPublicId),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total_clicks: { $sum: 1 },
        },
      },
      {
        $project: {
          date: "$_id",
          total_clicks: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    const resultVideo = await ClicksCta_Model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
          clickType: "video",
          ctaPublicId: parseInt(ctaPublicId),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total_watchTime: { $sum: "$videoStats.watchTime" },
        },
      },
      {
        $project: {
          date: "$_id",
          total_watchTime: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    // Initialize arrays of length 10 with 0s
    const viewClicksArray = new Array(dateDifference).fill(0);
    const linkClicksArray = new Array(dateDifference).fill(0);
    const videoWatchTimeArray = new Array(dateDifference).fill(0);

    // Populate the viewClicksArray based on the resultView
    console.log(resultView);
    resultView.forEach((item) => {
      const index = datesArray.indexOf(item.date);
      if (index !== -1) {
        viewClicksArray[index] = item.total_clicks;
      }
    });

    // Populate the linkClicksArray based on the resultLink
    resultLink.forEach((item) => {
      const index = datesArray.indexOf(item.date);
      if (index !== -1) {
        linkClicksArray[index] = item.total_clicks;
      }
    });

    // Populate the videoWatchTimeArray based on the resultVideo
    resultVideo.forEach((item) => {
      const index = datesArray.indexOf(item.date);
      if (index !== -1) {
        videoWatchTimeArray[index] = item.total_watchTime;
      }
    });

    res
      .status(200)
      .json({
        status: true,
        data: {
          resultView: viewClicksArray,
          resultLink: linkClicksArray,
          resultVideo: videoWatchTimeArray,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, data: "Something went wrong" });
  }
};

module.exports = {
  createCta,
  getCtabyPublicId,
  deleteCta,
  getCtaforUser,
  getAllCtaInSystem,
  updateCtaDetails,
  updateCtaCounts,
  getCtaClicksDetails,
  getAllCtaClickStats,
  getCtaClicksLogs,
  saveVideoStats,
  updateVideoViewCount,
  getVideoViewCount,
  saveTotalTimeSpent,
  saveCtaContact,
  getCtaContacts
};
