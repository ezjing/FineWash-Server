const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ScheduleMaster = sequelize.define(
    "ScheduleMaster",
    {
      sch_mst_idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "sch_mst_idx",
        comment: "스케줄 MST 인덱스",
      },
      bus_dtl_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "bus_dtl_idx",
        comment: "사업장 DTL 인덱스",
      },
      monday_yn: {
        type: DataTypes.CHAR(1),
        defaultValue: "N",
        field: "monday_yn",
        comment: "월요일 근무 YN",
      },
      tuesday_yn: {
        type: DataTypes.CHAR(1),
        defaultValue: "N",
        field: "tuesday_yn",
        comment: "화요일 근무 YN",
      },
      wednesday_yn: {
        type: DataTypes.CHAR(1),
        defaultValue: "N",
        field: "wednesday_yn",
        comment: "수요일 근무 YN",
      },
      thursday_yn: {
        type: DataTypes.CHAR(1),
        defaultValue: "N",
        field: "thursday_yn",
        comment: "목요일 근무 YN",
      },
      friday_yn: {
        type: DataTypes.CHAR(1),
        defaultValue: "N",
        field: "friday_yn",
        comment: "금요일 근무 YN",
      },
      saturday_yn: {
        type: DataTypes.CHAR(1),
        defaultValue: "N",
        field: "saturday_yn",
        comment: "토요일 근무 YN",
      },
      sunday_yn: {
        type: DataTypes.CHAR(1),
        defaultValue: "N",
        field: "sunday_yn",
        comment: "일요일 근무 YN",
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: true,
        field: "start_time",
        comment: "시작시간",
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: true,
        field: "end_time",
        comment: "종료시간",
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
      tableName: "schedule_masters",
      timestamps: true,
      createdAt: "create_date",
      updatedAt: "update_date",
    },
  );

  return ScheduleMaster;
};
