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
  const { questionId, isCorrect } = req.body;
  if (!questionId) return next(new Error("Question id is required"));

  const saveData = models.QuestionAttemp.create({
    userId: req.user.userId,
    questionId: questionId,
  });

  const saveAnwser = models.TrackAnswer.create({
    userId: req.user.userId,
    questionId: questionId,
    isCorrect: isCorrect,
  });

  return Promise.all([saveData, saveAnwser])
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

  const getPractice = models.TrackAnswer.findAll({
    where: { userId: userId },
    attributes: ["id", "isCorrect"],
    include: [
      {
        model: models.Question,
        as: "question",
        attributes: ["topic"],
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
        if (temp.filter((x) => x.isCorrect).length < 28) failedQuiz++;
        else {
          let isMediazionePassed =
            temp.filter((x) => x.isCorrect && x.topic == "Mediazione").length >=
            7;
          let isCivilePassed =
            temp.filter((x) => x.isCorrect && x.topic == "Civile").length >= 7;
          let isEstimoPassed =
            temp.filter((x) => x.isCorrect && x.topic == "Estimo").length >= 7;
          let isTributario =
            temp.filter((x) => x.isCorrect && x.topic == "Tributario").length >=
            7;

          if (
            isMediazionePassed &&
            isCivilePassed &&
            isEstimoPassed &&
            isTributario
          )
            passedQuiz++;
          else failedQuiz++;
        }
      });

      data[1].map((x) => {
        switch (x.question.topic) {
          case "Mediazione":
            totalMediazione++;
            if (x.isCorrect) answeredMediazione++;
            break;
          case "Civile":
            totalCivile++;
            if (x.isCorrect) answeredCivile++;
            break;
          case "Estimo":
            totalEstimo++;
            if (x.isCorrect) answeredEstimo++;
            break;
          case "Tributario":
            totalTributario++;
            if (x.isCorrect) answeredTributario++;
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
