const dev = {
    TEST_BUILD: true,
    API_URL: "https://localhost:5001"
};

const prod = {
    TEST_BUILD: false,
    API_URL: "https://dmeelker.hopto.org/passwords/api"
};

const config = process.env.REACT_APP_ENVIRONMENT == "production" ? prod : dev;

export default {...config}