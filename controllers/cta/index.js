const Cta_Model = require("../../models/Cta");
const CtaCounter_Model = require("../../models/CtaCounter");
const ClicksCta_Model = require("../../models/StatsCta");
const VideoViews_Model = require("../../models/VideoViews");
const CtaContacts_Model = require("../../models/CtaContacts");
const CtaTestimonial_Model = require("../../models/Testimonials");
const FeedbackCta_Model = require("../../models/FeedbackCta");
const moment = require("moment-timezone");

const { v4: uuidv4 } = require("uuid");
const { APP_URL } = require("../../config/config");
const { sendEmail } = require("../../lib/resend_email").default;
const Queue = require('bull');
const { azureBotResponse } = require('../../lib/azure_openai')


// Seperate the country from string
function separateUppercaseWord(str) {
  if (str === undefined || str === null) {
    return "Unknown";
  }

  const words = str.split(' ');
  const uppercaseWord = words.find(word => word === word.toUpperCase());

  if (uppercaseWord) {
    return `${uppercaseWord}`;
  }

  return str;
}

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
      feedback: true,
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
    // const videoView = await VideoViews_Model.findOne({
    //   ctaPublicId,
    //   userIpAddress,
    // });
    // if (videoView) {
    //   return res
    //     .status(500)
    //     .json({ success: false, data: "video view already exists" });
    // }
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
    const ctaContacts = await CtaContacts_Model.find({ ctaPublicId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, data: ctaContacts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
};

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
};

const saveTotalTimeSpent = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const {
    fieldToUpdate,
    source,
    userIpAddress,
    userLocation,
    userBrowser,
    userDevice,
    totalTimeSpent,
    ctaPublicId,
    localTime,
    prospectInfo
  } = req.body;
  const newCtaStat = new ClicksCta_Model({
    clickType:
      fieldToUpdate === "linkClicksCount"
        ? "link"
        : fieldToUpdate === "viewCount"
          ? "view"
          : fieldToUpdate === "video"
            ? "video"
            : "totalTimeSpent",
    userIpAddress,
    source,
    userLocation: userLocation?.includes("undefined") ? "N/A" : userLocation,
    userCountry: separateUppercaseWord(userLocation),
    userBrowser,
    userDevice,
    ctaPublicId,
    localTime,
    prospectInfo,
    // createdAt: new Date(),

    totalTimeSpent,
  });
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
    source,
    uniqueUserId,
    userIpAddress,
    userLocation,
    userBrowser,
    userDevice,
    videoStats,
    ctaPublicId,
    prospectInfo,
    clientDeviceDetect
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

  const currentCta = await Cta_Model.findOne({ ctaPublicId });
  const newUserClicks = new ClicksCta_Model({
    userIpAddress,
    source,
    uniqueUserId,
    userLocation: userLocation?.includes("undefined") ? "N/A" : userLocation,
    userCountry: separateUppercaseWord(userLocation),
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
    prospectInfo,
    clientDeviceDetect: clientDeviceDetect,
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
        // console.log(data)
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

  try {
    const data = await Cta_Model.updateOne(
      { ctaPublicId: submitrequest?.ctaPublicId },
      { $set: submitrequest.data }
    )

    return res.status(200).json({ status: true, data });
  } catch (error) {
    return res.status(500).json({ status: false, data: "Something went wrong" });
  }
};

// Get All CTA
const getAllUserTags = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { ctaPublicId } = req.params;

  const publicId = Number(ctaPublicId);

  if (isNaN(publicId)) {
    return res.status(400).json({ status: false, data: "Invalid ctaPublicId format" });
  }

  try {
    // Find the document and select only the tags field
    const result = await Cta_Model.findOne(
      { ctaPublicId: publicId },
      { tags: 1, _id: 0 } // 1 means include, 0 means exclude
    );

    if (!result) {
      return res.status(200).json({ status: true, data: [] });
    }

    return res.status(200).json({ status: true, data: result?.tags || [] });
  } catch (error) {
    return res.status(500).json({ status: false, data: "Something went wrong" });
  }
};

// Update CTA Tags
const updateCtaTags = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { ctaPublicId, tags } = req.body;

  // Ensure ctaPublicId is a number
  const publicId = Number(ctaPublicId);

  if (isNaN(publicId)) {
    return res.status(400).json({ status: false, data: "Invalid ctaPublicId format" });
  }

  try {

    // Update the document
    const updatedCta = await Cta_Model.findOneAndUpdate(
      { ctaPublicId: publicId },
      { $set: { tags: tags } },
      { new: true, runValidators: true }
    );

    if (!updatedCta) {
      return res.status(404).json({ status: false, data: "CTA not found" });
    }
    
    return res.status(200).json({ status: true, updatedCta });
  } catch (error) {
    return res.status(500).json({ status: false, data: "Something went wrong" });
  }
};

// Update CTA Feedback Setting
const updateCtaFeedbackSetting = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const submitrequest = req.body;
  console.log("CTA Feedback Setting", submitrequest?.ctaPublicId, submitrequest?.data);

  try {
    const data = await Cta_Model.updateOne(
      { ctaPublicId: submitrequest?.ctaPublicId },
      { $set: submitrequest.data }
    )

    return res.status(200).json({ status: true, data });
  } catch (error) {
    return res.status(500).json({ status: false, data: "Something went wrong" });
  }
};

// Get User Feedback Info
const getUserFeedbackInfo = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { clieIdLoc } = req.params;

  try {
    const existingDocument = await FeedbackCta_Model.findOne({
      clieIdLoc
    });
    console.log(existingDocument);
    return res.status(200).json({ status: true, data: existingDocument });
  } catch (error) {
    return res.status(500).json({ status: false, data: "Something went wrong" });
  }
};


// Get Feedback Numbers for CTA
const getDeviceCountData = async (req, res) => {
  const { ctaPublicId } = req.params;
  try {
    const results = await ClicksCta_Model.aggregate([
      {
        $match: {
          ctaPublicId: Number(ctaPublicId),
          clientDeviceDetect: { $in: ['Tablet', 'Mobile', 'Desktop'] }
        }
      },
      {
        $group: {
          _id: '$clientDeviceDetect',
          count: { $sum: 1 }
        }
      }
    ]);

    // Create an object to store counts
    const counts = {
      Tablet: 0,
      Mobile: 0,
      Desktop: 0
    };

    // Populate the counts object
    results.forEach(result => {
      counts[result._id] = result.count;
    });

    console.log("YOUR DATA",counts);
    res.status(200).json({ status: true, data: [counts.Tablet, counts.Mobile, counts.Desktop] });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get Feedback Numbers for CTA
const getFeedbackNumberPerCTA = async (req, res) => {
  const { ctaPublicId } = req.params;
  try {
    const result = await FeedbackCta_Model.aggregate([
      { $match: { ctaPublicId: ctaPublicId } },
      {
        $group: {
          _id: null,
          likes: {
            $sum: {
              $cond: [{ $eq: ["$feedback", "like"] }, 1, 0]
            }
          },
          dislikes: {
            $sum: {
              $cond: [{ $eq: ["$feedback", "dislike"] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          likes: 1,
          dislikes: 1
        }
      }
    ]);
    const data = result.length > 0 ? result[0] : { likes: 0, dislikes: 0 };
    res.status(200).json({ status: true, data: data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Feedback
const getFeedbackClient = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const submitrequest = req.body;

  try {
    const existingDocument = await FeedbackCta_Model.findOne({
      ctaPublicId: submitrequest?.ctaPublicId,
      clieIdLoc: submitrequest?.clieIdLoc
    });

    if (existingDocument) {
      const updatedDocument = await FeedbackCta_Model.findOneAndUpdate(
        { ctaPublicId: submitrequest?.ctaPublicId, clieIdLoc: submitrequest?.clieIdLoc },
        { $set: { feedback: submitrequest?.feedback } },
        { new: true }
      );
      console.log("Updated document:", updatedDocument);

      return res.status(200).json({ status: true, data: updatedDocument });
    } else {
      const newDocument = new FeedbackCta_Model({
        ctaPublicId: submitrequest?.ctaPublicId,
        clieIdLoc: submitrequest?.clieIdLoc,
        feedback: submitrequest?.feedback
      });
      const savedDocument = await newDocument.save();
      console.log("New document created:", savedDocument);
      return res.status(200).json({ status: true, data: savedDocument });
    }

  } catch (error) {
    return res.status(500).json({ status: false, data: "Something went wrong" });
  }
};

const updateCtaCounts = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { ctaPublicId } = req.params;
  const {
    fieldToUpdate,
    source,
    uniqueUserId,
    userIpAddress,
    userLocation,
    userBrowser,
    userDevice,
    linkName,
    timezone,
    prospectInfo,
    clientDeviceDetect
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
  // const localTime = moment().tz(timezone).toDate();
  const localTime = moment().tz(timezone).format('HH:mm:ss');
  console.log('Local Time:', localTime);

  const currentCta = await Cta_Model.findOne({ ctaPublicId });

  const newUserClicks = new ClicksCta_Model({
    userIpAddress,
    source,
    uniqueUserId,
    userLocation: userLocation?.includes("undefined") ? "N/A" : userLocation,
    userCountry: separateUppercaseWord(userLocation),
    userBrowser,
    userDevice,
    ctaUid: currentCta._id,
    clickType:
      fieldToUpdate === "linkClicksCount" ? "link"
        : fieldToUpdate === "viewCount" ? "view"
          : fieldToUpdate === "video" ? "video"
            : fieldToUpdate === "scroll" ? "scroll"
              : fieldToUpdate === "ctaOpened" ? "ctaOpened"
                : fieldToUpdate === "chat" ? "chat" : fieldToUpdate,
    ctaPublicId,
    linkName,
    localTime,
    prospectInfo,
    clientDeviceDetect,
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
    const meetingsBookedData = await ClicksCta_Model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
          clickType: "meetingScheduled",
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
    const chatData = await ClicksCta_Model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
          clickType: "chat",
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


    const videoViews = await VideoViews_Model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
          ctaPublicId: ctaPublicId,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total_views: { $sum: 1 },
        },
      },
      {
        $project: {
          date: "$_id",
          total_views: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ])

    const resultCtaClick = await ClicksCta_Model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
          clickType: "ctaOpened",
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

    // console.log("videoviews data ", videoViews);
    // Initialize arrays of length 10 with 0s
    const viewClicksArray = new Array(dateDifference).fill(0);
    const linkClicksArray = new Array(dateDifference).fill(0);
    const videoWatchTimeArray = new Array(dateDifference).fill(0);
    const videoViewsArray = new Array(dateDifference).fill(0);
    const ctaClicksArray = new Array(dateDifference).fill(0);
    const meetingsBookedArray = new Array(dateDifference).fill(0);
    const chatArray = new Array(dateDifference).fill(0);

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

    // Populate the ctaClicksArray based on the resultCtaClick
    resultCtaClick.forEach((item) => {
      const index = datesArray.indexOf(item.date);
      if (index !== -1) {
        ctaClicksArray[index] = item.total_clicks;
      }
    })

    // Populate the videoViewsArray based on the videoViews
    videoViews.forEach((item) => {
      const index = datesArray.indexOf(item.date);
      if (index !== -1) {
        videoViewsArray[index] = item.total_views;
      }
    })

    // Populate the meetingsBookedArray based on the meetingsBookedData
    meetingsBookedData.forEach((item) => {
      const index = datesArray.indexOf(item.date);
      if (index !== -1) {
        meetingsBookedArray[index] = item.total_clicks;
      }
    })

    // Populate the chatArray based on the chatData
    chatData.forEach((item) => {
      const index = datesArray.indexOf(item.date);
      if (index !== -1) {
        chatArray[index] = item.total_clicks;
      }
    })

    res.status(200).json({
      status: true,
      data: {
        resultView: viewClicksArray,
        resultLink: linkClicksArray,
        resultVideo: videoWatchTimeArray,
        videoViews: videoViewsArray,
        resultCtaClick: ctaClicksArray,
        meetingsBooked: meetingsBookedArray,
        chatData: chatArray
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, data: "Something went wrong" });
  }
};

const saveTestimonial = async (req, res) => {
  try {
    const { ctaPublicId, data } = req.body;
    // const testimonials = data.testimonials;
    // const links = data.links;
    console.log(data);
    const isExists = await CtaTestimonial_Model.findOne({ ctaPublicId });
    if (isExists) {
      const updatedData = await CtaTestimonial_Model.findOneAndUpdate({ ctaPublicId }, {
        testimonials: {
          testimonials: data.testimonials,
          links: data.links
        }
      });
      return res.status(200).json({ success: true, data: updatedData });
    } else {
      const newTestimonial = new CtaTestimonial_Model({
        ctaPublicId,
        testimonials: {
          testimonials: data.testimonials,
          links: data.links
        },
      });
      const savedData = await newTestimonial.save();
      return res.status(200).json({ success: true, data: savedData });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const allCtaPublicIds = await Cta_Model.find({ organizationId }).select("ctaPublicId").select("title");
    const ctaPublicIds = allCtaPublicIds.map((item) => item.ctaPublicId.toString());
    const titleMap = {};
    allCtaPublicIds.forEach((item) => {
      titleMap[item.ctaPublicId] = item.title;
    })
    const allContacts = await CtaContacts_Model.aggregate([
      {
        $match: {
          ctaPublicId: { $in: ctaPublicIds },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      }
    ]);
    console.log(allContacts);
    return res.status(200).json({ success: true, data: allContacts, map: titleMap });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
}

const getTestimonials = async (req, res) => {
  try {
    const { ctaPublicId } = req.params;
    const data = await CtaTestimonial_Model.findOne({ ctaPublicId });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
};

const totalCtas = async (req, res) => {
  const { organizationId } = req.params;
  try {
    const totalCtas = await Cta_Model.countDocuments({ organizationId });
    return res.status(200).json({ success: true, data: totalCtas });
  }
  catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
}

const getTopPerformingCTAs = async (req, res) => {
  const { organizationId } = req.params;
  try {
    const allCtaPublicIds = await Cta_Model.find({ organizationId }).select("ctaPublicId").select("title");
    const map = {};
    allCtaPublicIds.forEach((item) => {
      map[item.ctaPublicId] = item.title;
    });
    // finding total number of clicks where type is link or scroll or view
    const totalClicks = await ClicksCta_Model.aggregate([
      {
        $match: {
          ctaPublicId: { $in: allCtaPublicIds.map(item => item.ctaPublicId) },
          clickType: { $in: ["link", "scroll", "view", "video"] }
        }
      },
      {
        $group: {
          _id: "$ctaPublicId",
          totalClicks: { $sum: 1 }
        }
      },
      {
        $sort: {
          totalClicks: -1
        }
      }
    ]);

    allCtaPublicIds.forEach((item) => {
      const cta = totalClicks.find((click) => click._id === item.ctaPublicId);
      if (!cta) {
        totalClicks.push({ _id: item.ctaPublicId, totalClicks: 0 });
      }
    });

    return res.status(200).json({ success: true, data: totalClicks, mapper: map });
  }
  catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
}

const getDevicesInfo = async (req, res) => {
  const { organizationId } = req.params;
  try {
    const allCtaPublicIds = await Cta_Model.find({ organizationId }).select("ctaPublicId");
    // finding the counts documents group by device for each ctaPublicId
    const devices = await ClicksCta_Model.aggregate([
      {
        $match: {
          ctaPublicId: { $in: allCtaPublicIds.map(item => item.ctaPublicId) }
        }
      },
      {
        $group: {
          _id: "$userDevice",
          count: { $sum: 1 }
        }
      }
    ]);
    // console.log(devices);
    return res.status(200).json({ success: true, data: devices });
  }
  catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
}



const viewCTA = async (req, res) => {
  const { ctaPublicId } = req.params;
  const { u } = req.query;
  console.log(u);


  const referer = req.headers['referer'] || req.headers['referrer'];
  const utm_source = req.query.utm_source;
  const utm_medium = req.query.utm_medium;

  console.log(referer, ctaPublicId, utm_source, utm_medium);

  const data = await Cta_Model.findOne({ ctaPublicId });

  if (utm_source && utm_medium === 'email') {
    res.send(`Click from ${utm_source} email`);
  } else if (referer) {
    const domain = new URL(referer).hostname;
    let referalDomain = "Unknown";

    if (domain.includes('facebook.com')) {
      referalDomain = "Facebook";
    } else if (domain.includes('linkedin.com')) {
      referalDomain = "LinkedIn";
    } else if (domain.includes('twitter.com') || domain.includes('t.co')) {
      referalDomain = "Twitter";
    } else if (domain.includes('instagram.com')) {
      referalDomain = "Instagram";
    } else if (domain.includes('medium.com')) {
      referalDomain = "Medium";
    } else if (domain.includes('reddit.com')) {
      referalDomain = "Reddit";
    } else if (domain.includes('tumblr.com')) {
      referalDomain = "Tumblr";
    } else if (domain.includes('youtube.com')) {
      referalDomain = "Youtube";
    } else if (domain.includes('quora.com')) {
      referalDomain = "Quora";
    } else if (domain.includes('pinterest.com')) {
      referalDomain = "Pinterest";
    } else {
      // Unknown
      referalDomain = "Direct";
    }

    if (u) {
      console.log(u);
      res.redirect(`${APP_URL}/${data?.typecta}/${data?.ctaPublicId}?r=${referalDomain}&u=${u}`);
    } else {
      console.log("No U");
      res.redirect(`${APP_URL}/${data?.typecta}/${data?.ctaPublicId}?r=${referalDomain}`);
    }

  } else {
    if (u) {
      console.log(u);
      res.redirect(`${APP_URL}/${data?.typecta}/${data?.ctaPublicId}?r=Direct&u=${u}`);
    } else {
      console.log("No U");
      res.redirect(`${APP_URL}/${data?.typecta}/${data?.ctaPublicId}?r=Direct`);
    }
  }
}

const getCtaViewsInDateRange = async (req, res) => {
  const { organizationId } = req.params;
  try {
    const allCtaPublicIds = await Cta_Model.find({ organizationId }).select("ctaPublicId");
    // finding the count of documents created on each date of last week for each ctaPublicId
    const dateArrayLastWeek = [];
    for (let i = 6; i >= 0; i--) {
      let date = new Date();
      date.setDate(date.getDate() - i);
      dateArrayLastWeek.push(date.toISOString().split('T')[0]);
    }
    // finding the date range from current month's 1st date to current date
    const dateRangeMonthToDate = [];
    const date = new Date();
    // const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    // first date of current month
    const tempdate = new Date();
    const firstDate = new Date(tempdate.setDate(1));
    // console.log("first Date", firstDate)
    let diff = 0;
    while (firstDate.toISOString().split('T')[0] !== date.toISOString().split('T')[0]) {
      diff += 1;
      dateRangeMonthToDate.push(firstDate.toISOString().split('T')[0]);
      firstDate.setDate(firstDate.getDate() + 1);
    }
    // console.log("dateRangeMonthToDate", dateRangeMonthToDate);
    // console.log("lastWeek", dateArrayLastWeek);
    dateRangeMonthToDate.push(firstDate.toISOString().split('T')[0]);
    diff += 1;
    const viewsWeek = await ClicksCta_Model.aggregate([
      {
        $match: {
          ctaPublicId: { $in: allCtaPublicIds.map(item => item.ctaPublicId) },
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 6))
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 },
          // root: { $push: "$$ROOT" }
        }
      }
    ]);
    // console.log(viewsWeek);
    const viewsMonthToDate = await ClicksCta_Model.aggregate([
      {
        $match: {
          ctaPublicId: { $in: allCtaPublicIds.map(item => item.ctaPublicId) },
          createdAt: {
            $gte: new Date(date.getFullYear(), date.getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      }
    ])

    // console.log(dateRangeMonthToDate);
    const viewsWeekArray = Array(dateArrayLastWeek.length).fill(0);
    const viewsMonthToDateArray = Array(diff).fill(0);
    viewsWeek.forEach((item) => {
      const index = dateArrayLastWeek.indexOf(item._id);
      if (index !== -1) {
        viewsWeekArray[index] = item.count;
      }
    });
    // console.log("viewsWeeks", viewsWeekArray)

    viewsMonthToDate.forEach((item) => {
      const index = dateRangeMonthToDate.indexOf(item._id);
      if (index !== -1) {
        viewsMonthToDateArray[index] = item.count;
      }
    });
    // console.log(viewsMonthToDateArray)

    return res.status(200).json({ success: true, viewsWeekArray, dateArrayLastWeek, viewsMonthToDateArray, dateRangeMonthToDate });

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
}

const getTotalActiveCTAs = async (req, res) => {
  const { organizationId } = req.params;
  try {
    const totalActiveCtas = await Cta_Model.countDocuments({ organizationId, status: 1 });
    return res.status(200).json({ success: true, data: totalActiveCtas });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }

}

const getTotalPausedCTAs = async (req, res) => {
  const { organizationId } = req.params;
  try {
    const totalPausedCtas = await Cta_Model.countDocuments({ organizationId, status: 2 });
    return res.status(200).json({ success: true, data: totalPausedCtas });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
}



const getCtaSourcesData = async (req, res) => {
  const { ctaPublicId } = req.params;
  try {
    const data = await ClicksCta_Model.aggregate([
      {
        $match: {
          ctaPublicId: parseInt(ctaPublicId)
        }
      },
      // {
      //   $group: {
      //     _id: "$source",
      //     count: { $sum: 1 }
      //   }
      // }
    ]);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
}

const getCtaClicksLogsInTimeRange = async (req, res) => {
  const { ctaPublicId1, ctaPublicId2, fromDate } = req.body;
  console.log(ctaPublicId1, ctaPublicId2, fromDate);
  dateRangeArray = [];
  const date = new Date(fromDate);
  const today = new Date();
  while (date.toISOString().split('T')[0] !== today.toISOString().split('T')[0]) {
    dateRangeArray.push(date.toISOString().split('T')[0]);
    date.setDate(date.getDate() + 1);
  }
  dateRangeArray.push(date.toISOString().split('T')[0]);
  console.log(dateRangeArray);
  try {
    // finding the count of documents created on each date of the time range for each ctaPublicId1 group by clickType
    const data1 = await ClicksCta_Model.aggregate([
      {
        $match: {
          ctaPublicId: parseInt(ctaPublicId1),
          createdAt: {
            $gte: new Date(fromDate)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 },
          doc: { $push: "$$ROOT" }

        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]);
    console.log(data1);
    const data2 = await ClicksCta_Model.aggregate([
      {
        $match: {
          ctaPublicId: parseInt(ctaPublicId2),
          createdAt: {
            $gte: new Date(fromDate)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 },
          doc: { $push: "$$ROOT" }
        }
      }
    ]);

    linkDataArray1 = Array(dateRangeArray.length).fill(0);
    linkDataArray2 = Array(dateRangeArray.length).fill(0);
    viewDataArray1 = Array(dateRangeArray.length).fill(0);
    viewDataArray2 = Array(dateRangeArray.length).fill(0);
    ctaOpenedDataArray1 = Array(dateRangeArray.length).fill(0);
    ctaOpenedDataArray2 = Array(dateRangeArray.length).fill(0);
    engagementDataArray1 = Array(dateRangeArray.length).fill(0);
    engagementDataArray2 = Array(dateRangeArray.length).fill(0);
    meetingScheduledDataArray1 = Array(dateRangeArray.length).fill(0);
    meetingScheduledDataArray2 = Array(dateRangeArray.length).fill(0);

    data1.forEach((item) => {
      const index = dateRangeArray.indexOf(item._id);
      if (index !== -1) {
        item.doc.forEach((doc) => {
          if (doc.clickType === 'link') {
            linkDataArray1[index] += 1;
          } else if (doc.clickType === 'view') {
            viewDataArray1[index] += 1;
          } else if (doc.clickType === 'ctaOpened') {
            ctaOpenedDataArray1[index] += 1;
          } else if (doc.clickType === 'link' || doc.clickType === 'scroll' || doc.clickType === 'video') {
            engagementDataArray1[index] += 1;
          } else if (doc.clickType === 'meetingScheduled') {
            meetingScheduledDataArray1[index] += 1;
          }
        });
      }
    })

    console.log(linkDataArray1);


    data2.forEach((item) => {
      const index = dateRangeArray.indexOf(item._id);
      if (index !== -1) {
        item.doc.forEach((doc) => {
          if (doc.clickType === 'link') {
            linkDataArray2[index] += 1;
          } else if (doc.clickType === 'view') {
            viewDataArray2[index] += 1;
          } else if (doc.clickType === 'ctaOpened') {
            ctaOpenedDataArray2[index] += 1;
          } else if (doc.clickType === 'link' || doc.clickType === 'scroll' || doc.clickType === 'video') {
            engagementDataArray2[index] += 1;
          } else if (doc.clickType === 'meetingScheduled') {
            meetingScheduledDataArray2[index] += 1;
          }
        });
      }
    })
    console.log(linkDataArray2);

    return res.status(200).json({ success: true, data1: { linkDataArray1, viewDataArray1, ctaOpenedDataArray1, engagementDataArray1, meetingScheduledDataArray1 }, data2: { linkDataArray2, viewDataArray2, ctaOpenedDataArray2, engagementDataArray2, meetingScheduledDataArray2 }, dateRangeArray });

    // return res.status(200).json({ success: true, data1Array, data2Array, dateRangeArray });
  }
  catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
}

const getCtaTimeMap = async (req, res) => {
  const { ctaPublicId } = req.params;
  console.log(ctaPublicId);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  try {
    // finding the count of documents in time range of 1 hour from 1:00 to 24:00 of any day for each ctaPublicId
    const data = await ClicksCta_Model.aggregate([
      {
        $match: {
          ctaPublicId: parseInt(ctaPublicId)
        }
      },
      {
        $group: {
          _id: {
            country: "$userCountry",
            hour: { $hour: { date: "$createdAt", timezone: timeZone } },
          },
          date: { $first: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {

        $addFields: {
          newdate: {
            $dateToString: {
              date: "$date",
              timezone: timeZone
            }
          }
        }
      },
      {
        $sort: {
          date: 1
        }
      }
    ]);
    console.log(data);
    data.forEach((item) => {
      console.log(`${item.root.createdAt}--> ${new Date(item.root.createdAt).getHours()}`)
    })

    const initializeHours = () => {
      const hours = [];
      for (let i = 0; i < 24; i++) {
        hours.push({ hour: i, count: 0 });
      }
      return hours;
    };
    console.log(data);
    const result = data.reduce((acc, item) => {
      const { country } = item._id;
      // const hour = new Date(item.date).getHours();
      const hour = new Date(new Date(item.date).getTime() + (5.5 * 60 * 60 * 1000)).getUTCHours();
      const count = item.count;

      if (!acc[country]) {
        acc[country] = initializeHours();
      }

      // Find the hour in the array and update the count
      const hourIndex = acc[country].findIndex(h => h.hour === hour);
      if (hourIndex !== -1) {
        acc[country][hourIndex].count = count;
      }

      return acc;
    }, {});

    // console.log("time map ", result);
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
}

const getTotalCtaClicked = async (req, res) => {
  const { organizationId } = req.params;
  const allCtaPublicIds = await Cta_Model.find({ organizationId }).select("ctaPublicId");
  const totalClicks = await ClicksCta_Model.aggregate([
    {
      $match: {
        ctaPublicId: { $in: allCtaPublicIds.map(item => item.ctaPublicId) },
        clickType: { $in: ["link", "scroll", "view", "video"] }
      }
    },
    {
      $group: {
        _id: "$ctaPublicId",
        totalClicks: { $sum: 1 }
      },

    },
  ]);
  return res.status(200).json({ success: true, data: totalClicks.length });

}

function getDaysBetweenDates(date1, date2) {
  // Calculate the time difference in milliseconds
  console.log(date1, date2);
  const timeDifference = Math.abs(date2 - date1);

  // Convert time difference from milliseconds to days
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
}
const getTotalStatsInTimeRange = async (req, res) => {
  const { organizationId } = req.params;
  let { startDate } = req.body;
  // const dateDiff = new Date().getDate() - new Date(startDate).getDate();
  const dateDiff = getDaysBetweenDates(new Date(startDate), new Date());
  const allCtaPublicIds = await Cta_Model.find({ organizationId }).select("ctaPublicId");
  console.log("dateDiff ", dateDiff);

  if (dateDiff <= 31 && dateDiff > 0) {
    const dateArray = [];
    for (let i = dateDiff; i >= 0; i--) {
      let date = new Date();
      date.setDate(date.getDate() - i);
      dateArray.push(date.toISOString().split('T')[0]);
    }
    const data = await ClicksCta_Model.aggregate([
      {
        $match: {
          ctaPublicId: { $in: allCtaPublicIds.map(item => item.ctaPublicId) },
          createdAt: {
            $gte: new Date(startDate)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          activity: { $push: "$$ROOT" },
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]);
    //  console.log(data);

    const dataArray = {}
    dateArray.forEach((date) => {
      dataArray[date] = {
        linkClicks: 0,
        viewCount: 0,
        ctaOpened: 0,
        engagements: 0,
        meetingScheduled: 0
      }
    })


    data.forEach((item) => {
      const index = dateArray.indexOf(item._id);
      if (index !== -1) {
        item.activity.forEach((activity) => {
          if (activity.clickType === "link") {
            dataArray[item._id].linkClicks += 1;
          } else if (activity.clickType === "view") {
            dataArray[item._id].viewCount += 1;
          } else if (activity.clickType === "ctaOpened") {
            dataArray[item._id].ctaOpened += 1;
          } else if (activity.clickType === 'link' || activity.clickType === 'scroll' || activity.clickType === 'video') {
            dataArray[item._id].engagements += 1;
          } else if (activity.clickType === 'meetingScheduled') {
            dataArray[item._id].meetingScheduled += 1;
          }
        });
      }
    })
    return res.status(200).json({ success: true, data: dataArray, dateArray });
  } else {
    const monthArray = [];
    const fromDate = new Date(startDate);
    monthArray.push(`${new Date(fromDate).getMonth() + 1} - ${new Date(fromDate).getFullYear()}`)
    startDate = new Date(fromDate).setMonth(new Date(fromDate).getMonth() + 1);
    while (new Date(startDate).getMonth() !== new Date().getMonth()) {
      monthArray.push(`${new Date(startDate).getMonth() + 1} - ${new Date(startDate).getFullYear()}`)
      startDate = new Date(startDate).setMonth(new Date(startDate).getMonth() + 1);
    }
    monthArray.push(`${new Date(startDate).getMonth() + 1} - ${new Date(startDate).getFullYear()}`);
    console.log(monthArray);
    const data = await ClicksCta_Model.aggregate([
      {
        $match: {
          ctaPublicId: { $in: allCtaPublicIds.map(item => item.ctaPublicId) },
          createdAt: {
            $gte: fromDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" }
          },
          activity: { $push: "$$ROOT" },
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]);
    console.log(monthArray);
    const dataArray = {}
    monthArray.forEach((date) => {
      dataArray[date] = {
        linkClicks: 0,
        viewCount: 0,
        ctaOpened: 0,
        engagements: 0,
        meetingScheduled: 0
      }
    })
    console.log(data)
    data.forEach((item) => {
      const val = `${new Date(item._id).getMonth() + 1} - ${new Date(item._id).getFullYear()}`
      const index = monthArray.indexOf(val);
      console.log(index);
      if (index !== -1) {
        item.activity.forEach((activity) => {
          if (activity.clickType === "link") {
            dataArray[val].linkClicks += 1;
          } else if (activity.clickType === "view") {
            dataArray[val].viewCount += 1;
          } else if (activity.clickType === "ctaOpened") {
            dataArray[val].ctaOpened += 1;
          } else if (activity.clickType === 'link' || activity.clickType === 'scroll' || activity.clickType === 'video') {
            dataArray[val].engagements += 1;
          } else if (activity.clickType === 'meetingScheduled') {
            dataArray[val].meetingScheduled += 1;
          }
        });
      }
    })
    return res.status(200).json({ success: true, data: dataArray, dateArray: monthArray });

  }

}

const getTopPerformingCtaInTimeRange = async (req, res) => {
  const { startDate } = req.body;
  const { organizationId } = req.params;
  const allCtaPublicIds = await Cta_Model.find({ organizationId }).select("ctaPublicId").select("title");
  const mapper = {};
  allCtaPublicIds.forEach((item) => {
    mapper[item.ctaPublicId] = item.title;
  });
  const data = await ClicksCta_Model.aggregate([
    {
      $match: {
        ctaPublicId: { $in: allCtaPublicIds.map(item => item.ctaPublicId) },
        createdAt: {
          $gte: new Date(startDate)
        }
      }
    },
    {
      $group: {
        _id: "$ctaPublicId",
        totalClicks: { $sum: 1 }
      }
    },
    {
      $sort: {
        totalClicks: -1
      }
    }
  ])

  return res.status(200).json({ success: true, data, mapper });

}

const getAllCtaStatsInTimeRange = async (req, res) => {
  const { organizationId } = req.params;
  const { startDate } = req.body;
  console.log(startDate);

  const allCtaPublicIds = await Cta_Model.find({ organizationId }).select("ctaPublicId").select('title').select('typecta');
  const mapper = {};
  allCtaPublicIds.forEach((item) => {
    mapper[item.ctaPublicId] = { title: item.title, typecta: item.typecta };
  })
  const data = await ClicksCta_Model.aggregate([
    {
      $match: {
        ctaPublicId: { $in: allCtaPublicIds.map(item => item.ctaPublicId) },
        createdAt: {
          $gte: new Date(startDate)
        }
      }
    },
    {
      $group: {
        _id: {
          ctaPublicId: "$ctaPublicId",
          clickType: "$clickType"
        },
        count: { $sum: 1 }
      }
    }
  ]);
  const result = data.reduce((acc, item) => {
    const { ctaPublicId, clickType } = item._id;
    const count = item.count;

    if (!acc[ctaPublicId]) {
      acc[ctaPublicId] = {
        linkClicks: 0,
        viewCount: 0,
        ctaOpened: 0,
        engagements: 0,
        meetingScheduled: 0
      };
    }

    if (clickType === "link") {
      acc[ctaPublicId].linkClicks = count;
    } else if (clickType === "view") {
      acc[ctaPublicId].viewCount = count;
    } else if (clickType === "ctaOpened") {
      acc[ctaPublicId].ctaOpened = count;
    } else if (clickType === 'link' || clickType === 'scroll' || clickType === 'video') {
      acc[ctaPublicId].engagements = count;
    } else if (clickType === 'meetingScheduled') {
      acc[ctaPublicId].meetingScheduled = count;
    }

    return acc;
  }, {});
  // console.log(result);
  return res.status(200).json({ success: true, data: result, mapper });
}

const sendMailToContacts = async (req, res) => {
  const { ctaPublicId } = req.params;
  console.log(ctaPublicId);
  try {
    const contacts = await CtaContacts_Model.aggregate([
      {
        $match: {
          ctaPublicId: ctaPublicId,
          notify_status: 'To be Notified'
        }
      }
    ])
    // await CtaContacts_Model.deleteMany({ ctaPublicId: ctaPublicId });
    // console.log(contacts);
    const ctaType = await Cta_Model.findOne({ ctaPublicId }).select('typecta');
    console.log(ctaType?.typecta);
    console.log(ctaPublicId)

    // return;
    contacts.forEach(async (contact, i) => {
      const emailResponse = await sendEmail(`${contact.firstName} ${contact.lastName}`, contact.email, ctaPublicId, ctaType?.typecta);
      console.log(emailResponse);
      if (emailResponse.success) {
        await CtaContacts_Model.findByIdAndUpdate(contact._id, { notify_status: "Notified" });
      }
    })

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("mailing error : ", error);
    return res.status(500).json({ success: false, data: "Something went wrong while sending mail" });

  }

}

const getBotResponse = async (req, res) => {
  const { ctaPublicId } = req.params;
  const { message } = req.body;
  try {

    const information = await Cta_Model.findOne({ ctaPublicId }).select('aiAgent');
    // console.log(information);
    const responseFromBot = await azureBotResponse(information.aiAgent, message)
    return res.status(200).json({ success: true, data: responseFromBot });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: "Something went wrong" });
  }
}

const getClicklogsInTimeRange = async (req, res) => {
  const { ctaPublicId } = req.params;
  const { startDate } = req.body;
  console.log("timerange timerange", ctaPublicId, startDate);
  const data = await ClicksCta_Model.aggregate([
    {
      $match: {
        ctaPublicId: parseInt(ctaPublicId),
        createdAt: {
          $gte: new Date(startDate)
        }
      }
    },
    {
      $sort: {
        // sort the data in descending order of createdAt
        createdAt: -1
      }
    }
  ])
  // console.log("data click logs",data);
  return res.status(200).json({ success: true, data });
}

const getTotalMeetingBooked = async (req, res) => {
  const { organizationId } = req.params;
  const allCtaPublicIds = await Cta_Model.find({ organizationId }).select("ctaPublicId");
  const totalClicks = await ClicksCta_Model.aggregate([
    {
      $match: {
        ctaPublicId: { $in: allCtaPublicIds.map(item => item.ctaPublicId) },
        clickType: { $in: ["meetingScheduled"] }
      }
    },
    {
      $group: {
        _id: "$ctaPublicId",
        totalClicks: { $sum: 1 }
      },

    },
  ]);
  return res.status(200).json({ success: true, data: totalClicks.length });
}

const getTotalLinksClicked = async (req, res) => {
  const { organizationId } = req.params;
  const allCtaPublicIds = await Cta_Model.find({ organizationId }).select("ctaPublicId");
  const totalClicks = await ClicksCta_Model.aggregate([
    {
      $match: {
        ctaPublicId: { $in: allCtaPublicIds.map(item => item.ctaPublicId) },
        clickType: { $in: ["link"] }
      }
    },
    {
      $group: {
        _id: "$ctaPublicId",
        totalClicks: { $sum: 1 }
      },

    },
  ]);
  return res.status(200).json({ success: true, data: totalClicks.length });
}
const extractOS = (userAgent) => {
  if (/Windows/i.test(userAgent)) {
    if (/Windows Phone/i.test(userAgent)) {
      return 'Windows Phone';
    }
    return 'Windows';
  } else if (/Android/i.test(userAgent)) {
    return 'Android';
  } else if (/Linux/i.test(userAgent)) {
    return 'Linux';
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'iOS';
  } else if (/Mac/i.test(userAgent)) {
    return 'Mac OS';
  } else {
    return 'Unknown';
  }
};

const getAllCtaDataInTimeRange = async (req, res) => {
  const { organizationId, range } = req.body;
  console.log(organizationId, range);
  let startDate = new Date();
  // These should be in the range of 7 Days, 14 Days, 3 Weeks, Month to Date, 3 Months, 6 Months, 12 Months, All Lifetime
  if (range === "7 Days") {
    startDate.setDate(startDate.getDate() - 6);
  } else if (range === "14 Days") {
    startDate.setDate(startDate.getDate() - 13);
  } else if (range === "3 Weeks") {
    startDate.setDate(startDate.getDate() - 20);
  } else if (range === "Month to Date") {
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  } else if (range === "3 Months") {
    startDate.setMonth(startDate.getMonth() - 2);
  } else if (range === "6 Months") {
    startDate.setMonth(startDate.getMonth() - 5);
  } else if (range === "12 Months") {
    startDate.setMonth(startDate.getMonth() - 11);
  } else if (range === "All Lifetime") {
    startDate = new Date("2021-01-01");
  }

  const initializeHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push({ hour: i, count: 0 });
    }
    return hours;
  };

  console.log(startDate);
  try {
    const allCtaPublicIds = await Cta_Model.find({ organizationId }).select("ctaPublicId").select('title').select('typecta');
    const mapper = {};
    allCtaPublicIds.forEach((item) => {
      mapper[item.ctaPublicId] = { title: item.title, typecta: item.typecta };
    })
    const data = await ClicksCta_Model.aggregate([
      {
        $match: {
          ctaPublicId: { $in: allCtaPublicIds.map(item => item.ctaPublicId) },
          createdAt: {
            $gte: startDate
          }
        }
      },
      {
        $group: {
          _id: "$ctaPublicId",
          stat: { $push: "$$ROOT" },
        }
      }
    ]);

    // get  timemap for each ctaPublicId for each country group by hours
    const timeMap = data.reduce((acc, item) => {
      const ctaPublicId = item._id;
      const stat = item.stat;
      acc[ctaPublicId] = {};
      stat.forEach((item) => {
        const country = item.userCountry;
        const hour = new Date(new Date(item.createdAt).getTime() + (5.5 * 60 * 60 * 1000)).getUTCHours();
        if (!acc[ctaPublicId][country]) {
          acc[ctaPublicId][country] = {};
        }
        if (!acc[ctaPublicId][country][hour]) {
          acc[ctaPublicId][country][hour] = 0;
        }
        acc[ctaPublicId][country][hour] += 1;
      })
      return acc;
    }, {});

    console.log(timeMap);

    // get top 5 performing CTAs with most linkClicks groupby ctaPublicId
    let topPerformingCtas = {};
    data.forEach((item) => {
      topPerformingCtas[item._id] = {}
      item.stat.forEach((stat) => {
        if (Object.keys(topPerformingCtas[item._id]).length > 5) {
          return;
        }
        if (stat.clickType === "link") {
          if (topPerformingCtas[item._id][stat.linkName]) {
            topPerformingCtas[item._id][stat.linkName].count += 1;
          } else {
            topPerformingCtas[item._id][stat.linkName] = { count: 1 };
          }
        }
      })
    })

    // sort the topPerformingCtas based on the count of linkClicks
    for (const ctaPublicId in topPerformingCtas) {
      topPerformingCtas[ctaPublicId] = Object.fromEntries(Object.entries(topPerformingCtas[ctaPublicId]).sort((a, b) => b[1].count - a[1].count));
    }

    let topPerformingCountries = {};
    data.forEach((item) => {
      item.stat.forEach((stat) => {
        let ctaPublicId = item._id;
        let country = stat.userCountry;
        let device = extractOS(stat.userDevice);

        if (device.includes("undefined")) {
          device = "Unknown";
        }
        if (country.includes("undefined")) {
          country = "Unknown";
        }
        topPerformingCountries[ctaPublicId] = topPerformingCountries[ctaPublicId] ? topPerformingCountries[ctaPublicId] : {};
        topPerformingCountries[ctaPublicId][country] = topPerformingCountries[ctaPublicId][country] ? topPerformingCountries[ctaPublicId][country] : {};
        topPerformingCountries[ctaPublicId][country][device] = topPerformingCountries[ctaPublicId][country][device] ? topPerformingCountries[ctaPublicId][country][device] + 1 : 1;

      })
    })

    // sort the topPerformingCountries based on total devices used in each country
    for (const ctaPublicId in topPerformingCountries) {
      for (const country in topPerformingCountries[ctaPublicId]) {
        topPerformingCountries[ctaPublicId][country] = Object.fromEntries(Object.entries(topPerformingCountries[ctaPublicId][country]).sort((a, b) => b[1] - a[1]));
      }
    }
    // now sort the topPerformingCountries based on the total number of devices used in each country
    for (const ctaPublicId in topPerformingCountries) {
      topPerformingCountries[ctaPublicId] = Object.fromEntries((Object.entries(topPerformingCountries[ctaPublicId])).sort((a, b) => {
        let totalDevicesA = Object.values(a[1]).reduce((acc, item) => acc + item, 0);
        let totalDevicesB = Object.values(b[1]).reduce((acc, item) => acc + item, 0);
        return totalDevicesB - totalDevicesA;
      }));

    }
    // console.log('topPerformingCountries', topPerformingCountries);


    const result = data.reduce((acc, item) => {
      const ctaPublicId = item._id;
      const stat = item.stat;
      const linkClicks = stat.filter(item => item.clickType === "link").length;
      const viewCount = stat.filter(item => item.clickType === "view").length;
      const ctaOpened = stat.filter(item => item.clickType === "ctaOpened").length;
      const engagements = stat.filter(item => item.clickType === "link" || item.clickType === "scroll" || item.clickType === "video").length;
      const meetingScheduled = stat.filter(item => item.clickType === "meetingScheduled").length;
      const videoViews = stat.filter(item => item.clickType === "video").length;

      // topPerformingCtas[ctaPublicId][item.stat.linkName].count+=linkClicks;

      acc[ctaPublicId] = {
        ctaName: mapper[ctaPublicId].title,
        ctaType: mapper[ctaPublicId].typecta,
        linkClicks,
        viewCount,
        ctaOpened,
        engagements,
        meetingScheduled,
        topPerformingLinks: Object.keys(topPerformingCtas[ctaPublicId]).map(link => ({ link, count: topPerformingCtas[ctaPublicId][link].count })),
        topPerformingCountries: Object.keys(topPerformingCountries[ctaPublicId]).map(country => ({ country, devices: Object.keys(topPerformingCountries[ctaPublicId][country]).map(device => ({ device, count: topPerformingCountries[ctaPublicId][country][device] })) })),
        timeMap: timeMap[ctaPublicId]
      }


      if (mapper[ctaPublicId]?.typecta === "video") {
        acc[ctaPublicId].videoViews = videoViews;
        acc[ctaPublicId].watchTime = stat.filter(item => item.clickType === "video").reduce((acc, item) => acc + item.videoStats.watchTime, 0);
      }


      return acc;
    }, {});
    // let resultArray = [];
    const resultArray = Object.keys(result).map((key) => {
      return {
        ctaPublicId: key,
        ...result[key],
      }
    }
    )


    return res.status(200).json({ success: true, resultArray });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
  // return res.status(200).json({ success: true, data: result, mapper });
}


module.exports = {
  viewCTA,
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
  updateCtaFeedbackSetting,
  getFeedbackNumberPerCTA,
  updateVideoViewCount,
  getVideoViewCount,
  saveTotalTimeSpent,
  getUserFeedbackInfo,
  saveCtaContact,
  getCtaContacts,
  saveTestimonial,
  getTestimonials,
  getAllContacts,
  totalCtas,
  getFeedbackClient,
  getTopPerformingCTAs,
  getDevicesInfo,
  getDeviceCountData,
  getCtaViewsInDateRange,
  getCtaSourcesData,
  getTotalActiveCTAs,
  getTotalPausedCTAs,
  getCtaClicksLogsInTimeRange,
  getCtaTimeMap,
  getTotalCtaClicked,
  getTotalStatsInTimeRange,
  getTopPerformingCtaInTimeRange,
  getAllCtaStatsInTimeRange,
  sendMailToContacts,
  getBotResponse,
  getClicklogsInTimeRange,
  getTotalMeetingBooked,
  getTotalLinksClicked,
  getAllCtaDataInTimeRange,
  updateCtaTags,
  getAllUserTags
};
