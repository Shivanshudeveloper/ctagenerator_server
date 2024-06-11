const Cta_Model = require("../../models/Cta");
const CtaCounter_Model = require("../../models/CtaCounter");
const ClicksCta_Model = require("../../models/StatsCta");
const VideoViews_Model = require("../../models/VideoViews");
const CtaContacts_Model = require("../../models/CtaContacts");
const CtaTestimonial_Model = require("../../models/Testimonials");
const { v4: uuidv4 } = require("uuid");
const { APP_URL } = require("../../config/config");

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
    userLocation: userLocation.includes("undefined") ? "N/A" : userLocation,
    userCountry: separateUppercaseWord(userLocation),
    userBrowser,
    userDevice,
    ctaPublicId,
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

  const currentCta = await Cta_Model.findOne({ ctaPublicId });
  const newUserClicks = new ClicksCta_Model({
    userIpAddress,
    source,
    userLocation: userLocation.includes("undefined") ? "N/A" : userLocation,
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
    source,
    userIpAddress,
    userLocation,
    userBrowser,
    userDevice,
    linkName
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
  const currentCta = await Cta_Model.findOne({ ctaPublicId });
  const newUserClicks = new ClicksCta_Model({
    userIpAddress,
    source,
    userLocation: userLocation.includes("undefined") ? "N/A" : userLocation,
    userCountry: separateUppercaseWord(userLocation),
    userBrowser,
    userDevice,
    ctaUid: currentCta._id,
    clickType:
      fieldToUpdate === "linkClicksCount"
        ? "link"
        : fieldToUpdate === "viewCount"
        ? "view"
        : fieldToUpdate === "video"?"video"
        : fieldToUpdate === "scroll"?"scroll": "ctaOpened",
    ctaPublicId,
    linkName,
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
    console.log("videoviews data ",videoViews);  
    // Initialize arrays of length 10 with 0s
    const viewClicksArray = new Array(dateDifference).fill(0);
    const linkClicksArray = new Array(dateDifference).fill(0);
    const videoWatchTimeArray = new Array(dateDifference).fill(0);
    const videoViewsArray = new Array(dateDifference).fill(0);

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

    // Populate the videoViewsArray based on the videoViews
    videoViews.forEach((item) => {
      const index = datesArray.indexOf(item.date);
      if (index !== -1) {
        videoViewsArray[index] = item.total_views;
      }
    })

    res.status(200).json({
      status: true,
      data: {
        resultView: viewClicksArray,
        resultLink: linkClicksArray,
        resultVideo: videoWatchTimeArray,
        videoViews: videoViewsArray,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, data: "Something went wrong" });
  }
};

const saveTestimonial = async (req,res) => {
  try {
    const { ctaPublicId, data } = req.body;
    // const testimonials = data.testimonials;
    // const links = data.links;
    console.log(data);
    const isExists = await CtaTestimonial_Model.findOne({ ctaPublicId});
    if(isExists) {
      const updatedData = await CtaTestimonial_Model.findOneAndUpdate({ ctaPublicId }, {
        testimonials:{
          testimonials:data.testimonials,
          links:data.links
        }
      });
      return res.status(200).json({ success: true, data:updatedData  });
    }else{
      const newTestimonial = new CtaTestimonial_Model({
        ctaPublicId,
        testimonials:{
          testimonials:data.testimonials,
          links:data.links
        },
      });
      const savedData = await newTestimonial.save();
      return res.status(200).json({ success: true, data:savedData  });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
};

const getAllContacts = async (req,res) => {
  try {
    const { organizationId } = req.params;
    const allCtaPublicIds = await Cta_Model.find({ organizationId }).select("ctaPublicId").select("title");
    const ctaPublicIds = allCtaPublicIds.map((item) => item.ctaPublicId.toString());
    const titleMap= {};
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
    return res.status(200).json({ success: true, data: allContacts,map:titleMap });
  }catch(error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
}

const getTestimonials = async (req,res) => {
  try {
    const { ctaPublicId } = req.params;
    const data = await CtaTestimonial_Model.findOne({ ctaPublicId });
    console.log("getTestimonials ",data.testimonials);
    return res.status(200).json({ success: true, data});
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
          clickType: { $in: ["link", "scroll","view","video"] }
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
      },
      {
        $limit: 5
      }
    ]);
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
    

    res.redirect(`${APP_URL}/${data?.typecta}/${data?.ctaPublicId}?r=${referalDomain}`);
  } else {
    res.redirect(`${APP_URL}/${data?.typecta}/${data?.ctaPublicId}?r=Direct`);
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
    const dateRangeMonthToDate =[];
    const date = new Date();
    const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    console.log("first Date",firstDate)
    let diff = 0;
    while (firstDate.toISOString().split('T')[0] !== date.toISOString().split('T')[0]) {
      diff+=1;
      dateRangeMonthToDate.push(firstDate.toISOString().split('T')[0]);
      firstDate.setDate(firstDate.getDate() + 1);
    }
    dateRangeMonthToDate.push(firstDate.toISOString().split('T')[0]);
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
          count: { $sum: 1 }
        }
      }
    ]);

    const viewsMonthToDate = await ClicksCta_Model.aggregate([
      {
        $match: {
          ctaPublicId: { $in: allCtaPublicIds.map(item => item.ctaPublicId) },
          createdAt: {
            $gte:new Date(date.getFullYear(), date.getMonth(), 1)
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

    console.log(dateRangeMonthToDate);
    const viewsWeekArray = Array(7).fill(0);
    const viewsMonthToDateArray = Array(diff).fill(0);
    viewsWeek.forEach((item) => {
      const index = dateArrayLastWeek.indexOf(item._id);
      if (index !== -1) {
        viewsWeekArray[index] = item.count;
      }
    });

    viewsMonthToDate.forEach((item) => {
      const index = dateRangeMonthToDate.indexOf(item._id);
      if (index !== -1) {
        viewsMonthToDateArray[index] = item.count;
      }
    });
    console.log(viewsMonthToDateArray)

    return res.status(200).json({ success: true, viewsWeekArray,dateArrayLastWeek,viewsMonthToDateArray,dateRangeMonthToDate});

  }catch(error) {
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
  }catch(error) {
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
  }catch(error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
}



const getCtaSourcesData = async (req, res) => {
  const {ctaPublicId} = req.params;
  try {
    const data = await ClicksCta_Model.aggregate([
      {
        $match: {
          ctaPublicId: parseInt(ctaPublicId)
        }
      },
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 }
        }
      }
    ]);
    return res.status(200).json({ success: true, data });
  }catch(error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
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
  updateVideoViewCount,
  getVideoViewCount,
  saveTotalTimeSpent,
  saveCtaContact,
  getCtaContacts,
  saveTestimonial,
  getTestimonials,
  getAllContacts,
  totalCtas,
  getTopPerformingCTAs,
  getDevicesInfo,
  getCtaViewsInDateRange,
  getCtaSourcesData,
  getTotalActiveCTAs,
  getTotalPausedCTAs
};
