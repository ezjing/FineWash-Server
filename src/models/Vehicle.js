const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Vehicle = sequelize.define(
    "Vehicle",
    {
      veh_idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "veh_idx",
      },
      mem_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "mem_idx",
        comment: "회원 인덱스",
      },
      vehicle_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "vehicle_type",
        comment: "차종 (준중형 등)",
      },
      model: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "model",
        comment: "모델 (그렌저 등)",
      },
      vehicle_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "vehicle_number",
        comment: "차량번호",
      },
      color: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "color",
        comment: "색상",
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "year",
        comment: "연식",
      },
      remark: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "remark",
        comment: "비고",
      },
      create_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "create_id",
      },
      update_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "update_id",
      },
    },
    {
      tableName: "vehicles",
      timestamps: true,
      createdAt: "created_date",
      updatedAt: "update_date",
    }
  );

  return Vehicle;
};
