const moment = require("moment");

exports.formatMessage = (user, message) => {
   return {
      user, 
      message,
      time: moment().format("h:mm a")
   }
}

