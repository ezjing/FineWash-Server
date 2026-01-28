const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ScheduleDetail = sequelize.define(
    "ScheduleDetail",
    {
      sch_dtl_idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "sch_dtl_idx",
        comment: "스케줄 DTL 인덱스",
      },
      sch_mst_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "sch_mst_idx",
        comment: "스케줄 MST 인덱스",
      },
      bus_dtl_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "bus_dtl_idx",
        comment: "사업장 DTL 인덱스",
      },
      schedule_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "schedule_date",
        comment: "일자",
      },
      holiday_yn: {
        type: DataTypes.CHAR(1),
        defaultValue: "N",
        field: "holiday_yn",
        comment: "휴일 YN",
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
      tableName: "schedule_details",
      timestamps: true,
      createdAt: "create_date",
      updatedAt: "update_date",
    },
  );

  return ScheduleDetail;
};
