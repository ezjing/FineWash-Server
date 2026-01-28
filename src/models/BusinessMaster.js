const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const BusinessMaster = sequelize.define(
    "BusinessMaster",
    {
      bus_mst_idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "bus_mst_idx",
        comment: "사업장 MST 인덱스",
      },
      mem_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "mem_idx",
        comment: "회원 인덱스",
      },
      business_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "business_number",
        comment: "사업자 번호",
      },
      company_name: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: "company_name",
        comment: "회사명",
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "phone",
        comment: "전화번호",
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "email",
        comment: "이메일",
      },
      address: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "address",
        comment: "주소",
      },
      business_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "business_type",
        comment: "개인/법인",
      },
      deposit_yn: {
        type: DataTypes.CHAR(1),
        defaultValue: "N",
        field: "deposit_yn",
        comment: "예약금 YN",
      },
      deposit_amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "deposit_amount",
        comment: "예약금",
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
      tableName: "business_masters",
      timestamps: true,
      createdAt: "create_date",
      updatedAt: "update_date",
    },
  );

  return BusinessMaster;
};
