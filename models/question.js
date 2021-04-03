"use strict";
const { Model } = require("sequelize");
const shuffle = require("shuffle-array");

module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.hasMany(models.QuestionAttemp, { as: "attemptedQuestions" });
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
      include: [
        {
          required: false,
          model: models.QuestionAttemp,
          as: "attemptedQuestions",
          where: { userId: userId },
          attributes: ["questionId"],
        },
      ],
    }).then((result) => {
      let question = result.sort(compare).slice(0, 20);
      shuffle(question);
      question = question.map((x) => {
        x = JSON.parse(JSON.stringify(x));
        x.answers = JSON.parse(x.answers);
        shuffle(x.answers);
        delete x.attemptedQuestions;
        return x;
      });

      return question;
    });
  };

  const compare = (a, b) => {
    if (a.attemptedQuestions.length < b.attemptedQuestions.length) {
      return -1;
    }
    if (a.attemptedQuestions.length > b.attemptedQuestions.length) {
      return 1;
    }
    return 0;
  };
  return Question;
};
