const db = require("./fireBase");
const express = require("express");
const router = express.Router();
const JWT = require('jsonwebtoken');

router.post("/send", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }


    const decode = JWT.verify(token , process.env.JWT_SECRET);
    const senderId = decode.id;
    const {receiverId, message } = req.body;
    const timestamp = new Date();

    const conversationId = senderId < receiverId ? `${senderId}_${receiverId}` : `${receiverId}_${senderId}`;

    const conversationRef = db.collection("chats").doc(conversationId);

    const data = await  conversationRef.collection("messages").add({
        senderId,
        receiverId,
        message,
        timestamp,
      });

    res.status(200).json({ success: true, message: "Message sent!", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/messages/:user1/:user2", async (req, res) => {
    try {
      const { user1, user2 } = req.params;
  
      // Generate the conversation ID
      const conversationId = user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
  
      // Reference to the messages subcollection
      const messagesSnapshot = await db
        .collection("chats")
        .doc(conversationId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .get();
  
      // Convert Firestore snapshot to array
      const messages = messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });  
module.exports = router;
