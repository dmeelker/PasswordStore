const dev = {
    API_URL: "https://localhost:5001"
};

const prod = {
    API_URL: "http://dmeelker.hopto.org:5000"
};

const config = process.env.REACT_APP_ENVIRONMENT == "production" ? prod : dev;

export default {...config}