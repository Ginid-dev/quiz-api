"use strict";
const { Model } = require("sequelize");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.authData = (userData) => {
    const token = jwt.sign(
      {
        userId: userData.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "720h" }
    );

    let obj = {
      authToken: token,
      email: userData.email,
      emailVerified: userData.emailVerified,
    };

    return obj;
  };
  return User;
};
