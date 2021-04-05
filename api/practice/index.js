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

router.get("/rs/report", (req, res, next) => {
  const userId = req.user.userId;

  const findQuiz = models.Quiz.findAndCountAll({
    where: { isCompleted: true, userId: userId },
    attributes: ["questions"],
  });

  const getPractice = models.Question.findAll({
    attributes: ["topic"],
    include: [
      {
        required: false,
        model: models.QuestionAttemp,
        as: "attemptedQuestions",
        where: { userId: userId },
      },
    ],
  });

  return Promise.all([findQuiz, getPractice])
    .then((result) => {
      let data = result;
      let passedQuiz = 0,
        failedQuiz = 0;
      let totalMediazione = 0,
        totalCivile = 0,
        totalEstimo = 0,
        totalTributario = 0,
        answeredMediazione = 0,
        answeredCivile = 0,
        answeredEstimo = 0,
        answeredTributario = 0;

      data[0].rows.forEach((x) => {
        let temp = JSON.parse(x.questions);
        if (temp.filter((x) => x.isCorrect).length >= 28) passedQuiz++;
        else failedQuiz++;
      });

      data[1].map((x) => {
        switch (x.topic) {
          case "Mediazione":
            totalMediazione++;
            if (x.attemptedQuestions && x.attemptedQuestions.length)
              answeredMediazione++;
            break;
          case "Civile":
            totalCivile++;
            if (x.attemptedQuestions && x.attemptedQuestions.length)
              answeredCivile++;
            break;
          case "Estimo":
            totalEstimo++;
            if (x.attemptedQuestions && x.attemptedQuestions.length)
              answeredEstimo++;
            break;
          case "Tributario":
            totalTributario++;
            if (x.attemptedQuestions && x.attemptedQuestions.length)
              answeredTributario++;
            break;
        }
      });

      let obj = {
        totalQuiz: data[0].count,
        passedQuiz: passedQuiz,
        failedQuiz: failedQuiz,
        practice: {
          totalMediazione: totalMediazione,
          totalCivile: totalCivile,
          totalEstimo: totalEstimo,
          totalTributario: totalTributario,
          answeredMediazione: answeredMediazione,
          answeredCivile: answeredCivile,
          answeredEstimo: answeredEstimo,
          answeredTributario: answeredTributario,
        },
      };
      res.status(200).json({
        success: true,
        data: obj,
      });
    })
    .catch(next);
});

module.exports = router;
