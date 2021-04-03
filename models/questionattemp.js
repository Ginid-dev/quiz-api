"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class QuestionAttemp extends Model {
    static associate(models) {}
  }
  QuestionAttemp.init(
    {
      questionId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
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
      modelName: "QuestionAttemp",
    }
  );
  return QuestionAttemp;
};
