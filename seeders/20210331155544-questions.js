"use strict";
const models = require("../models");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return models.Question.destroy({
      truncate: { cascade: false },
    }).then(() => {
      let questions = [];
      const civileQuestions = require("../questions/Civile.json").questions;
      const estimoQuestion = require("../questions/Estimo.json").questions;
      const mediazioneQuestion = require("../questions/Mediazione.json")
        .questions;
      const tributarioQuestions = require("../questions/Tributario.json")
        .questions;

      civileQuestions.forEach((x) => {
        questions.push({
          topic: "Civile",
          question: x.question,
          answers: JSON.stringify(x.answers),
          correctAnswer: x.correct_answer,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      estimoQuestion.forEach((x) => {
        questions.push({
          topic: "Estimo",
          question: x.question,
          answers: JSON.stringify(x.answers),
          correctAnswer: x.correct_answer,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      mediazioneQuestion.forEach((x) => {
        questions.push({
          topic: "Mediazione",
          question: x.question,
          answers: JSON.stringify(x.answers),
          correctAnswer: x.correct_answer,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      tributarioQuestions.forEach((x) => {
        questions.push({
          topic: "Tributario",
          question: x.question,
          answers: JSON.stringify(x.answers),
          correctAnswer: x.correct_answer,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      return queryInterface.bulkInsert("Questions", questions, {});
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
