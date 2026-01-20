const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Reservation = sequelize.define(
    "Reservation",
    {
      resv_idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "resv_idx",
      },
      bus_dtl_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "bus_dtl_idx",
        comment: "사업장 DTL 인덱스",
      },
      mem_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "mem_idx",
        comment: "회원 인덱스",
      },
      veh_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "veh_idx",
        comment: "차량정보 인덱스",
      },
      main_option: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "main_option",
        comment: "예약 대옵션 (출장, 방문)",
      },
      mid_option: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "mid_option",
        comment: "예약 중옵션 (내/외부)",
      },
      sub_option: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "sub_option",
        comment: "예약 소옵션 (스팀, 내부먼지제거 등)",
      },
      vehicle_location: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "vehicle_location",
        comment: "자동차 위치",
      },
      contract_yn: {
        type: DataTypes.CHAR(1),
        defaultValue: "Y",
        field: "contract_yn",
        comment: "계약체결YN (기본값 승낙)",
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "date",
        comment: "예약일자",
      },
      time: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "time",
        comment: "예약시간",
      },
      imp_uid: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "imp_uid",
        comment: "포트원 결제 고유번호",
      },
      merchant_uid: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "merchant_uid",
        comment: "주문 고유번호",
      },
      payment_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "payment_amount",
        comment: "결제 금액",
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
      tableName: "reservations",
      timestamps: true,
      createdAt: "created_date",
      updatedAt: "update_date",
    }
  );

  return Reservation;
};

