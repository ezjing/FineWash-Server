const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const SystemCode = sequelize.define(
    "SystemCode",
    {
      sys_cd_idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "sys_cd_idx",
      },
      group_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "group_code",
        comment: "그룹코드",
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "code",
        comment: "코드",
      },
      code_name: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: "code_name",
        comment: "코드명",
      },
      seq: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "seq",
        comment: "정렬순서",
      },
      value1: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "value1",
        comment: "값1",
      },
      value2: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "value2",
        comment: "값2",
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
      tableName: "system_codes",
      timestamps: true,
      createdAt: "created_date",
      updatedAt: "update_date",
    }
  );

  return SystemCode;
};
