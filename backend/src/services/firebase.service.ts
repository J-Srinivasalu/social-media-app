import * as admin from "firebase-admin";
import config from "../config/config";

const serviceAccount = require(config.firebaseServiceFilePath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

export async function sendNotificationToSingleUser(
  recipientToken: string,
  title: string,
  body: string
): Promise<void> {
  const message: admin.messaging.Message = {
    data: {
      title: title,
      body: body,
    },
    token: recipientToken,
  };

  if (recipientToken == "") {
    console.error("Invalid recipient token");
    return;
  }
  console.log(`Recipient token : ${recipientToken}`);

  try {
    await messaging.send(message);
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

export async function sendNotificationToUsers(
  recipientTokens: string[],
  title: string,
  body: string
): Promise<void> {
  const messages = recipientTokens.map((recipientToken) => ({
    data: {
      title: title,
      body: body,
    },
    token: recipientToken, // Assume you have a function to get FCM tokens for users
  }));

  try {
    await messaging.sendEach(messages);
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
