import * as admin from "firebase-admin";
import config from "../config/config";

const serviceAccount = require(config.firebaseServiceFilePath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

export async function sendNotificationToSingleUser(
  recipientToken: string,
  data: { [key: string]: string }
): Promise<void> {
  const message: admin.messaging.Message = {
    data: data,
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
  data: { [key: string]: string }
): Promise<void> {
  const messages = recipientTokens.map((recipientToken) => ({
    data: data,
    token: recipientToken,
  }));

  try {
    await messaging.sendEach(messages);
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
