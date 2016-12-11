const Sequelize = require('sequelize');
const { Router } = require('express');
const { db, Hacker, ApplicationReview, HackerApplication } = require('js/server/models');
const { createHttpError } = require('./errors');

const statsRouter = new Router();

statsRouter.get('/', (req, res, next) => {

  // Get:
  // - The total number of applications
  // - The total number of sign ups
  // - The number of reviews (note that each application needs to be reviewed twice)
  // TODO: Get the numbers of reviews made per admin
  // - The number of applications that have been reviewed at least twice

  const hackerCountPromise = Hacker.count();
  const hackerApplicationCountPromise = HackerApplication.count();
  const reviewCountPromise = ApplicationReview.count();

  const applicationsReviewedQuery = 
    "SELECT COUNT(*) FROM (" + 
      "SELECT \"hackerApplicationId\", COUNT(id)" + 
      "FROM \"application-reviews\"" +
      "GROUP BY \"hackerApplicationId\"" +
    ") review_counts";

  const applicationsReviewedCountPromise = 
  db.query(applicationsReviewedQuery, { type: db.QueryTypes.SELECT }).then((counts) => {
    // Get the number from the object that's returned
    return parseInt(counts[0].count);
  });

  Promise.all([
    hackerCountPromise,
    hackerApplicationCountPromise,
    reviewCountPromise,
    applicationsReviewedCountPromise
  ])
  .then(
    ([
      hackerCount,
      hackerApplicationCount,
      reviewCount,
      applicationsReviewedCount,
    ]) => {
      res.json({
        hackerCount,
        hackerApplicationCount,
        reviewCount,
        applicationsReviewedCount
      });
    }
  ).catch(next);
});

module.exports = statsRouter;
