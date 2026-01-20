const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const FcmToken = sequelize.define(
    "FcmToken",
    {
      fcm_idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "fcm_idx",
      },
      mem_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "mem_idx",
        comment: "회원 인덱스",
      },
      token: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "token",
        comment: "FCM 토큰",
      },
      device_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "device_type",
        comment: "기기 유형 (mobile, tablet, pc)",
      },
      create_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "create_id",
      },
      create_date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "create_date",
        defaultValue: DataTypes.NOW,
      },
      update_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "update_id",
      },
      update_date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "update_date",
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "fcm_tokens",
      timestamps: true,
      createdAt: "create_date",
      updatedAt: "update_date",
    }
  );

  return FcmToken;
};
