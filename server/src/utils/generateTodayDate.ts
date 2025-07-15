import moment from 'moment';

export const generateTodayDate = (): Date => {
  // Create date at start of day in UTC time
  return moment().utc().startOf('day').toDate();
};