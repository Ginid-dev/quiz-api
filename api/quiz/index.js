const router = require("express").Router();
const models = require("../../models");

router.get("/", (req, res, next) => {
  const userId = req.user.userId;

  return models.Quiz.generateQuiz(models, userId)
    .then((result) => {
      res.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch(next);
});

router.post("/ans", (req, res, next) => {
  const { quizId, answer, questionId } = req.body;
  const userId = req.user.userId;

  if (!quizId) return next(new Error("Quiz Id is required"));

  if (!answer) return next(new Error("Answer is required"));

  if (!questionId) return next(new Error("Question Id is required"));

  const findQuiz = models.Quiz.findOne({
    where: { id: quizId },
  });

  const updateQuestionMap = models.QuestionAttemp.create({
    questionId: questionId,
    userId: userId,
  });

  return Promise.all([findQuiz, updateQuestionMap])
    .then((result) => {
      let quizData = result[0];
      let questions = JSON.parse(quizData.questions);
      let index = questions.findIndex((x) => x.id == questionId);

      if (index != -1 || index == null) {
        questions[index].userAnswer = answer;
        questions[index].isCorrect = answer == questions[index].correctAnswer;
        quizData.questions = JSON.stringify(questions);
      }

      quizData.answeredQuestions = quizData.answeredQuestions + 1;
      quizData.isCompleted =
        quizData.answeredQuestions == quizData.totalQuestions;
      return quizData.save();
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch(next);
});

module.exports = router;
