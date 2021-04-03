"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Quizzes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: { type: Sequelize.INTEGER, defaultValue: null },
      questions: {
        type: Sequelize.TEXT,
        defaultValue: null,
      },
      totalQuestions: { type: Sequelize.INTEGER, defaultValue: 0 },
      answeredQuestions: { type: Sequelize.INTEGER, defaultValue: 0 },
      isCompleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Quizzes");
  },
};
