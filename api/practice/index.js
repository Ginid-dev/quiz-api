const router = require("express").Router();
const models = require("../../models");

router.get("/:topic", (req, res, next) => {
  const { topic } = req.params;
  const userId = req.user.userId;
  return models.Question.createPractice(models, topic, userId)
    .then((result) => {
      res.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  const { questionId } = req.body;
  if (!questionId) return next(new Error("Question id is required"));

  return models.QuestionAttemp.create({
    userId: req.user.userId,
    questionId: questionId,
  })
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch(next);
});

module.exports = router;
