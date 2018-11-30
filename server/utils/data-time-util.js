const moment = require("moment");

module.exports.getExpiredTime = (currDate, expDate) => {

    let currentDate = moment(currDate);
    let expiryDate = moment(expDate);

    return currentDate.diff(expiryDate, "hours");
};

module.exports.getDateString = () => {
    return moment(new Date()).add(1, 'day').format('LL');
};
