'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Event, Stage_Event, Set_Time}) {
      Stage.belongsToMany(Event, {
        foreignKey: 'stage_id',
        as: 'events',
        through: Stage_Event
      })
      Stage.hasMany(Set_Time, {
        foreignKey: 'stage_id',
        as: 'set_time'
      })
    }
  }
  Stage.init({
    stage_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    stage_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.SMALLINT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Stage',
    tableName: 'stage',
    timestamp: false
  });
  return Stage;
};