const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let feedbackList = [];

app.get("/", (req, res) => res.send("Online Feedback System API is running"));

app.get("/api/feedback", (req, res) => res.json(feedbackList));

app.post("/api/feedback", (req, res) => {
  const { studentName, subject, rating, comments } = req.body;
  if (!studentName || !subject || !rating || !comments) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }
  const feedback = {
    id: Date.now(),
    studentName: String(studentName).trim(),
    subject: String(subject).trim(),
    rating: Number(rating),
    comments: String(comments).trim()
  };
  if (!feedback.studentName || !feedback.comments || feedback.rating < 1 || feedback.rating > 5) {
    return res.status(400).json({ message: "Please enter valid feedback details." });
  }
  feedbackList.unshift(feedback);
  res.status(201).json(feedback);
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
