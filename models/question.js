"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {}
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
  return Question;
};
