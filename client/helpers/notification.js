export default async ({ title, body, icon }) => {
  try {
    const errData = {};

    if (!('Notification' in window)) {
      // check if the browser supports notifications
      errData.message = 'This browser does not support desktop notification';
      throw errData;
    }

    if (
      document.visibilityState === 'hidden' &&
      Notification.permission === 'granted'
    ) {
      const notif = new Notification(title, { body, icon });

      notif.onerror = (error1) => {
        throw error1;
      };
    } else {
      // ask the user for permission
      await Notification.requestPermission();
    }
  } catch (error0) {
    console.error(error0.message);
  }
};
