"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TrackAnswer extends Model {
    static associate(models) {
      TrackAnswer.hasOne(models.Question, {
        sourceKey: "questionId",
        foreignKey: "id",
        as: "question",
      });
    }
  }
  TrackAnswer.init(
    {
      userId: DataTypes.INTEGER,
      questionId: DataTypes.INTEGER,
      isCorrect: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "TrackAnswer",
    }
  );
  return TrackAnswer;
};
