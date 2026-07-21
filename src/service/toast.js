import  {NotificationManager}  from "react-notifications";
import "react-notifications/lib/notifications.css";

export const Toast = ({ type = "success", message, time = 4000 }) => {
  if (Array.isArray(message)) {
    let item;

    for (item of message) {
      NotificationManager[type](item.message, "", parseInt(time));
    }
  } else {
    NotificationManager[type](message, "", parseInt(time));
  }
};
