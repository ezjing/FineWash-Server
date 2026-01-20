const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ReservationSchedule = sequelize.define(
    "ReservationSchedule",
    {
      resv_sch_idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "resv_sch_idx",
      },
      resv_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "resv_idx",
        comment: "예약 인덱스",
      },
      total_duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "total_duration",
        comment: "총 소요시간 (분)",
      },
      actual_duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "actual_duration",
        comment: "실 소요시간 (분)",
      },
      progress_status: {
        type: DataTypes.STRING(20),
        defaultValue: "before",
        field: "progress_status",
        comment: "진행여부 (전/중/후)",
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
      tableName: "reservation_schedules",
      timestamps: true,
      createdAt: "created_date",
      updatedAt: "update_date",
    }
  );

  return ReservationSchedule;
};
