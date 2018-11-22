import * as Sequelize from 'sequelize';

import Admin from './Admin';
import db from './db';
import HackerApplication from './HackerApplication';

interface ApplicationAssignmentAttributes {
  id?: number;
  adminId: number;
  hackerApplicationId: number;
}

type ApplicationAssignmentInstance = Sequelize.Instance<ApplicationAssignmentAttributes>
  & ApplicationAssignmentAttributes;

const attributes: SequelizeAttributes<ApplicationAssignmentAttributes> = {
  adminId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  hackerApplicationId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
};

const ApplicationAssignment =
  db.define<ApplicationAssignmentInstance, ApplicationAssignmentAttributes>('applicationAssignment', attributes, {
    tableName: 'application-assignments',
  });

ApplicationAssignment.belongsTo(Admin);
ApplicationAssignment.belongsTo(HackerApplication);

export default ApplicationAssignment;
