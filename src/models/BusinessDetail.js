const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const BusinessDetail = sequelize.define(
    "BusinessDetail",
    {
      bus_dtl_idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "bus_dtl_idx",
      },
      bus_mst_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "bus_mst_idx",
        comment: "사업장 MST 인덱스",
      },
      room_name: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: "room_name",
        comment: "룸 이름",
      },
      inactive_yn: {
        type: DataTypes.CHAR(1),
        defaultValue: "N",
        field: "inactive_yn",
        comment: "비활성화 YN",
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "start_date",
        comment: "시작일자",
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "end_date",
        comment: "종료일자",
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
      tableName: "business_details",
      timestamps: true,
      createdAt: "created_date",
      updatedAt: "update_date",
    }
  );

  return BusinessDetail;
};
