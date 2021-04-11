"use strict";
const { Model } = require("sequelize");
const shuffle = require("shuffle-array");

module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    static associate(models) {}
  }
  Quiz.init(
    {
      userId: { type: DataTypes.INTEGER, defaultValue: null },
      questions: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      totalQuestions: { type: DataTypes.INTEGER, defaultValue: 0 },
      answeredQuestions: { type: DataTypes.INTEGER, defaultValue: 0 },
      isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      modelName: "Quiz",
    }
  );

  Quiz.generateQuiz = (models, userId) => {
    return Quiz.findOne({
      where: { userId: userId, isCompleted: false },
      attributes: ["id", "questions", "totalQuestions", "answeredQuestions"],
    }).then((result) => {
      if (!result) return createQuiz(models, userId);
      result.questions = JSON.parse(result.questions);
      return result;
    });
  };

  const createQuiz = (models, userId) => {
    return models.Question.findAll({
      attributes: ["id", "topic", "question", "answers", "correctAnswer"],
      order: ["topic"],
      include: [
        {
          required: false,
          model: models.TrackAnswer,
          as: "trackAnswer",
          where: { userId: userId },
          attributes: ["userId", "questionId", "isCorrect"],
        },
      ],
    }).then((result) => {
      let questions = [];
      let mediazioneQuestion = result.filter((x) => x.topic == "Mediazione");
      mediazioneQuestion = sortQuestion(mediazioneQuestion, 10);

      let civileQuestion = result.filter((x) => x.topic == "Civile");
      civileQuestion = sortQuestion(civileQuestion, 10);

      let estimoQuestion = result.filter((x) => x.topic == "Estimo");
      estimoQuestion = sortQuestion(estimoQuestion, 10);

      let tributarioQuestion = result.filter((x) => x.topic == "Tributario");
      tributarioQuestion = sortQuestion(tributarioQuestion, 10);

      shuffle(mediazioneQuestion);
      shuffle(civileQuestion);
      shuffle(estimoQuestion);
      shuffle(tributarioQuestion);

      questions = questions
        .concat(mediazioneQuestion)
        .concat(civileQuestion)
        .concat(estimoQuestion)
        .concat(tributarioQuestion);

      questions = questions.map((x) => {
        x = JSON.parse(JSON.stringify(x));
        x.answers = JSON.parse(x.answers);
        shuffle(x.answers);
        delete x.trackAnswer;
        return x;
      });

      return Quiz.create({
        userId: userId,
        questions: JSON.stringify(questions),
        totalQuestions: questions.length,
      }).then((result) => {
        result.questions = JSON.parse(result.questions);
        return result;
      });
    });
  };

  const sortQuestion = (allQuestions, newQuestionLimit) => {
    let questions = allQuestions
      .filter((x) => !x.trackAnswer || !x.trackAnswer.length)
      .splice(0, newQuestionLimit);

    if (questions.length != newQuestionLimit)
      questions = questions.concat(allQuestions.sort(compare));

    return questions.splice(0, newQuestionLimit);
  };

  const compare = (a, b) => {
    const questionA = a.trackAnswer.filter((x) => !x.isCorrect).length;
    const questionB = b.trackAnswer.filter((x) => !x.isCorrect).length;

    if (questionA > questionB) return -1;

    if (questionA < questionB) return 1;

    return 0;
  };

  return Quiz;
};
