// const APP_URL = "http://localhost:3030/action";
const APP_URL = "https://app.ctagenerator.com/action";
const APP_MAIN_URL = "https://app.ctagenerator.com";

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


module.exports = {
    APP_URL,
    USER_PLANS,
    APP_MAIN_URL
}
