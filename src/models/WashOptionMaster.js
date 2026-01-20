const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const WashOptionMaster = sequelize.define(
    "WashOptionMaster",
    {
      wopt_mst_idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "wopt_mst_idx",
      },
      bus_mst_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "bus_mst_idx",
        comment: "사업장 MST 인덱스",
      },
      option_name: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: "option_name",
        comment: "옵션명",
      },
      vehicle_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "vehicle_type",
        comment: "차종",
      },
      seq: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "seq",
        comment: "정렬순서",
      },
      value1: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "value1",
        comment: "값1 (소요시간 분)",
      },
      value2: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "value2",
        comment: "값2 (가격)",
      },
      create_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "create_id",
        comment: "생성자 ID",
      },
      update_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "update_id",
        comment: "수정자 ID",
      },
    },
    {
      tableName: "wash_option_masters",
      timestamps: true,
      createdAt: "created_date",
      updatedAt: "update_date",
    }
  );

  return WashOptionMaster;
};
