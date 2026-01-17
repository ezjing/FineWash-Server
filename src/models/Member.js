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
      },
      bus_mst_idx: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "bus_mst_idx",
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "password",
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "name",
      },
      fcm_token: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "fcm_token",
      },
      address: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "address",
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "phone",
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
      },
      social_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "social_type",
      },
      social_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "social_id",
      },
      create_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "create_id",
      },
      update_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "update_id",
      },
      create_date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "create_date",
        defaultValue: DataTypes.NOW,
      },
      update_date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "update_date",
        defaultValue: DataTypes.NOW,
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
    }
  );

  // 비밀번호 검증 메서드
  Member.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  return Member;
};

