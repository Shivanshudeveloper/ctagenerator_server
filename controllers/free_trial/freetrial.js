const fs = require("fs");
const path = require("path");

const sendEmailAzure = require("../../lib/azure_email").sendEmail;

const templatePath1 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial1.html"
);
const templatePath2 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial2.html"
);
const templatePath3 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial3.html"
);
const templatePath4 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial4.html"
);
const templatePath5 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial5.html"
);
const templatePath6 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial6.html"
);
const templatePath7 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial7.html"
);
const templatePath8 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial8.html"
);
const templatePath9 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial9.html"
);
const templatePath10 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial10.html"
);
const templatePath11 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial11.html"
);
const templatePath12 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial12.html"
);
const templatePath13 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial13.html"
);
const templatePath14 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial14.html"
);
const templatePath15 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial15.html"
);
const templatePath16 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial16.html"
);
const templatePath17 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial17.html"
);
const templatePath18 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial18.html"
);
const templatePath19 = path.join(
  __dirname,
  "../../templates/freetrial/free_trial19.html"
);
const freetrial_template1 = fs.readFileSync(templatePath1, "utf8");
const freetrial_template2 = fs.readFileSync(templatePath2, "utf8");
const freetrial_template3 = fs.readFileSync(templatePath3, "utf8");
const freetrial_template4 = fs.readFileSync(templatePath4, "utf8");
const freetrial_template5 = fs.readFileSync(templatePath5, "utf8");
const freetrial_template6 = fs.readFileSync(templatePath6, "utf8");
const freetrial_template7 = fs.readFileSync(templatePath7, "utf8");
const freetrial_template8 = fs.readFileSync(templatePath8, "utf8");
const freetrial_template9 = fs.readFileSync(templatePath9, "utf8");
const freetrial_template10 = fs.readFileSync(templatePath10, "utf8");
const freetrial_template11 = fs.readFileSync(templatePath11, "utf8");
const freetrial_template12 = fs.readFileSync(templatePath12, "utf8");
const freetrial_template13 = fs.readFileSync(templatePath13, "utf8");
const freetrial_template14 = fs.readFileSync(templatePath14, "utf8");
const freetrial_template15 = fs.readFileSync(templatePath15, "utf8");
const freetrial_template16 = fs.readFileSync(templatePath16, "utf8");
const freetrial_template17 = fs.readFileSync(templatePath17, "utf8");
const freetrial_template18 = fs.readFileSync(templatePath18, "utf8");
const freetrial_template19 = fs.readFileSync(templatePath19, "utf8");

// Add organization users
const sendFreeTrial1 = async (req, res) => {
  var error = false;
  console.log("tesy");
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template1,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial2 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template2,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial3 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template3,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial4 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template4,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial5 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template5,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial6 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template6,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial7 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template7,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial8 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template8,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial9 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template9,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial10 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template10,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial11 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template11,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial12 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template12,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial13 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template13,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial14 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template14,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial15 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template15,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial16 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template16,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial17 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template17,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial18 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template18,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};
const sendFreeTrial19 = async (req, res) => {
  var error = false;
  res.setHeader("Content-Type", "application/json");

  const submitrequest = req.body;

  const config = {
    verification_link: submitrequest?.verification_link,
    email_to: submitrequest?.email_to,
    username: submitrequest?.username,
    appname: submitrequest?.appname,
    appurl: submitrequest?.appurl,
    agentname: submitrequest?.agentname,
    agenttitle: submitrequest?.agenttitle,
    email_to: submitrequest?.email_to,
  };

  const response = await sendEmailAzure(
    "Verification Email",
    freetrial_template19,
    config
  );
  if (response.status === "Succeeded") {
    res.status(200).json({ status: true, data: response });
  } else {
    res.status(400).json({ status: true, data: response });
  }
};

module.exports = {
  sendFreeTrial1,
  sendFreeTrial2,
  sendFreeTrial3,
  sendFreeTrial4,
  sendFreeTrial5,
  sendFreeTrial6,
  sendFreeTrial7,
  sendFreeTrial8,
  sendFreeTrial9,
  sendFreeTrial10,
  sendFreeTrial11,
  sendFreeTrial12,
  sendFreeTrial13,
  sendFreeTrial14,
  sendFreeTrial15,
  sendFreeTrial16,
  sendFreeTrial17,
  sendFreeTrial18,
  sendFreeTrial19,
};
