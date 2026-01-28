const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  const Member = sequelize.define(
    "Member",
    {
      mem_idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "mem_idx",
        comment: "회원 인덱스",
      },
      bus_mst_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "bus_mst_idx",
        comment: "사업장 MST 인덱스",
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "password",
        comment: "비밀번호",
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "name",
        comment: "이름",
      },
      address: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "address",
        comment: "주소",
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "phone",
        comment: "전화번호",
      },
      gender: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        field: "gender",
        comment: "성별 (M: 남성, F: 여성, N: 미선택)",
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "email",
        comment: "이메일",
      },
      social_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "social_type",
        comment: "소셜 유형",
      },
      social_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "social_id",
        comment: "소셜 아이디",
      },
      member_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "member_type",
        comment: "회원 유형 (C: 고객, B: 사업자, A: 관리자)",
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
      tableName: "members",
      timestamps: true,
      createdAt: "create_date",
      updatedAt: "update_date",
      hooks: {
        // 비밀번호 해싱
        beforeCreate: async (member) => {
          if (member.password) {
            const salt = await bcrypt.genSalt(10);
            member.password = await bcrypt.hash(member.password, salt);
          }
        },
        beforeUpdate: async (member) => {
          if (member.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            member.password = await bcrypt.hash(member.password, salt);
          }
        },
      },
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
      },
    },
  );

  // 비밀번호 검증 메서드
  Member.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  return Member;
};
