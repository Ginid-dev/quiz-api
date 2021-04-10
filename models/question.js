"use strict";
const { Model } = require("sequelize");
const shuffle = require("shuffle-array");

module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.hasMany(models.QuestionAttemp, { as: "attemptedQuestions" });
      Question.hasMany(models.TrackAnswer, { as: "trackAnswer" });
    }
  }
  Question.init(
    {
      topic: DataTypes.STRING,
      question: DataTypes.TEXT,
      answers: DataTypes.TEXT,
      correctAnswer: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Question",
    }
  );

  Question.createPractice = (models, topic, userId) => {
    return Question.findAll({
      where: { topic: topic },
      attributes: ["id", "answers", "correctAnswer", "question", "topic"],
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
      let question = result.sort(compare).slice(0, 20);

      shuffle(question);

      question = question.map((x) => {
        x = JSON.parse(JSON.stringify(x));
        x.answers = JSON.parse(x.answers);
        shuffle(x.answers);
        delete x.trackAnswer;
        return x;
      });

      return question;
    });
  };

  const compare = (a, b) => {
    const questionA = a.trackAnswer.filter((x) => !x.isCorrect).length;
    const questionB = b.trackAnswer.filter((x) => !x.isCorrect).length;

    if (questionA < questionB) return -1;

    if (questionA > questionB) return 1;

    return 0;
  };

  return Question;
};
