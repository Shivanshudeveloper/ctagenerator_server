// const APP_URL = "http://localhost:3030/action";
const APP_URL = "https://app.seefunnel.com/action";
const APP_MAIN_URL = "https://app.seefunnel.com";


// const OTHER_SERVICE_URL = "http://localhost:5050";
const OTHER_SERVICE_URL = "https://aiworkerresoruce-gpfuazapevbddsc2.eastus-01.azurewebsites.net";

// const CALLING_SERVICE_URL = "https://ctacallingservice-fqf6g5bdguazefc5.eastus-01.azurewebsites.net";
const CALLING_SERVICE_URL = "http://localhost:8080";

const OUTBOUND_CALLING_SERVICE_URL = "https://outboundcallingservice-dhg8e2h2g6ahdbb5.eastus-01.azurewebsites.net";

const WEBSITE_SCRAPER_SERVICE_URL = "http://172.206.249.185:8000";

// Unipile Base Url
const CALLBACK_UNIPILE = "https://ctagenerator-api.azurewebsites.net";
const APP_AGENTS_URL = "https://app.seefunnel.com/dashboard/aiagentspage";
const BASE_URL_UNIPILE = "https://api3.unipile.com:13360"


// const APP_AGENTS_URL = "http://localhost:3030/dashboard/aiagentspage";
// const CALLBACK_UNIPILE = "https://3707-103-106-235-1.ngrok-free.app";



const ACCESS_TOKEN_UNIPILE = process.env.ACCESS_TOKEN_UNIPILE;


const USER_PLANS = [
    {
        id: 1,
        plan: "basic",
        limit: 2
    },
    {
        id: 2,
        plan: "starter",
        limit: 5
    },
    {
        id: 3,
        plan: "premium",
        limit: 12
    }
]


// const OTHER_SERVICE_URL = "https://airesourcessortwindwork-bseud6bndzehgjg9.eastus-01.azurewebsites.net";



module.exports = {
    APP_URL,
    USER_PLANS,
    APP_MAIN_URL,
    OTHER_SERVICE_URL,
    CALLING_SERVICE_URL,
    OUTBOUND_CALLING_SERVICE_URL,
    WEBSITE_SCRAPER_SERVICE_URL,
    BASE_URL_UNIPILE,
    ACCESS_TOKEN_UNIPILE,
    CALLBACK_UNIPILE,
    APP_AGENTS_URL
}
