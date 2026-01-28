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
        comment: "예약 스케줄 인덱스",
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
        comment: "생성자",
      },
      create_date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "create_date",
        defaultValue: DataTypes.NOW,
        comment: "생성일",
      },
      update_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "update_id",
        comment: "수정자",
      },
      update_date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "update_date",
        defaultValue: DataTypes.NOW,
        comment: "수정일",
      },
    },
    {
      tableName: "reservation_schedules",
      timestamps: true,
      createdAt: "create_date",
      updatedAt: "update_date",
    },
  );

  return ReservationSchedule;
};
