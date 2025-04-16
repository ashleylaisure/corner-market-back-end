const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const router = express.Router();

const Conversation = require("../models/conversation.js");
const Message = require("../models/messages.js");
const User = require("../models/user.js");

//I.N.D.U.C.E.S.

// GET conversation details
router.get("/:conversationId", verifyToken, async (req, res) => {
  const { conversationId } = req.params;
  try {
    const conversation = await Conversation.findById(conversationId).populate({
      path: "participants",
      select: "username _id",
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET shows all of users conversations
router.get("/user/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "participants",
        select: "username",
      })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 },
      })
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post create new Conversation
router.post("/", verifyToken, async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    let existingConvo = await Conversation.findOne({
      participants: [senderId, receiverId],
    });

    if (existingConvo) {
      return res.status(200).json(existingConvo);
    }

    const newConversation = await Conversation.create({
      participants: [senderId, receiverId],
    });

    res.status(201).json(newConversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Create message and add to conversation
router.post("/:conversationId/messages", verifyToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { senderId, receiverId, message } = req.body;

    const newMessage = await Message.create({
      conversationId,
      senderId,
      receiverId,
      message,
    });
    const savedMessage = await newMessage.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      $push: { messages: savedMessage._id },
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Shows messages between users
router.get("/:conversationId/messages/", verifyToken, async (req, res) => {
  const { conversationId } = req.params;

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const messages = await Message.find({ conversationId })
      .sort("createdAt")
      .populate([
        { path: "senderId", select: "username" },
        { path: "receiverId", select: "username" },
      ]);

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
