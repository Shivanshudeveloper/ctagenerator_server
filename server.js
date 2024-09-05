const express = require("express");
require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const colors = require("colors");
const cors = require("cors");

// Route Files
const mainRoutes = require("./routes");
const aiRoutes = require("./routes/ai-route");
const ctaRoutes = require("./routes/cta-route");
const welcomeRoutes = require("./routes/welcome-route");
const verificationRoutes = require("./routes/verification-route");
const projectRoutes = require("./routes/project-route");
const emailJourneyRoutes = require("./routes/email-journey-route");
const paymentRoutes = require("./routes/payment");
const featureRoutes = require("./routes/feature-route");
const freetrialRoutes = require("./routes/free-trial");
const templateRoutes = require("./routes/template-route");
const leadsRoutes = require("./routes/leads-route");
const leadSerperRoutes = require("./routes/leadserper-route");
const userStatsRoutes = require("./routes/user-stats-route");
const linksTrackRoutes = require("./routes/link-track");
const projectTimelineRoutes = require("./routes/projectTimelineRoutes");
// require('./processors/index')
// DB Connection
const db = process.env.MONGODB_URI;


// Connect MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected".green.bold))
  .catch((err) => console.log(err));

// Logging Middleware function
const loggingMiddleware = (req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`.cyan.bold);
  next(); // Move to the next middleware or route handler
};

const app = express();

app.use(cors(), loggingMiddleware);

app.use(express.urlencoded({ limit: "50mb" }));

// Routing for API Service
app.use("/api/v1/main", express.json({ limit: "50mb" }), mainRoutes);
app.use("/api/v1/predictai", express.json({ limit: "50mb" }), aiRoutes);
app.use("/api/v1/main/leadserper", express.json({ limit: "50mb" }), leadSerperRoutes);

app.use("/api/v1/main/cta", express.json({ limit: "50mb" }), ctaRoutes);

app.use("/ctaview", express.json({ limit: "50mb" }), ctaRoutes);

app.use("/api/v1/main/leads", express.json({ limit: "50mb" }), leadsRoutes);
app.use(
  "/api/v1/main/userstats",
  express.json({ limit: "50mb" }),
  userStatsRoutes
);
app.use("/verificationapp", express.json({ limit: "50mb" }), linksTrackRoutes);

app.use("/api/v1/main/welcome", express.json({ limit: "50mb" }), welcomeRoutes);
app.use(
  "/api/v1/main/verification",
  express.json({ limit: "50mb" }),
  verificationRoutes
);
app.use("/api/v1/main/project", express.json({ limit: "50mb" }), projectRoutes);
app.use(
  "/api/v1/main/emailjourney",
  express.json({ limit: "50mb" }),
  emailJourneyRoutes
);
app.use(
  "/api/v1/main/payments",
  express.json({ limit: "50mb" }),
  paymentRoutes
);


app.use("/api/v1/main/feature", express.json({ limit: "50mb" }), featureRoutes);
app.use(
  "/api/v1/main/template",
  express.json({ limit: "50mb" }),
  templateRoutes
);

app.use(
  "/api/v1/main/freetrial",
  express.json({ limit: "50mb" }),
  freetrialRoutes
);

app.use(
  "/api/v1/main/projecttimeline",
  express.json({ limit: "50mb" }),
  projectTimelineRoutes
);



const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold));
