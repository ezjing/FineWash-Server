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
      tableName: "schedule_details",
      timestamps: true,
      createdAt: "created_date",
      updatedAt: "update_date",
    }
  );

  return ScheduleDetail;
};
