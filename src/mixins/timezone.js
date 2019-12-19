import * as moment from 'moment';

const timezone = {
    methods: {
    convertToUTC(date) {
      const UTCDate = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
      return UTCDate;
    },
      convertToLocalTime(date) {
        const localTime = moment(date)
        .local()
        .format('YYYY-MM-DD HH:mm:ss');
        return localTime;
      },
   formatedTime(orderTime) {
    const localTime = this.convertToLocalTime(orderTime);
    const time = moment(localTime).format('ddd, Do MMM');
    return time;
   },
   formatedTimer(orderTime) {
    const localTime = this.convertToLocalTime(orderTime);
    const timer = moment(localTime).toDate();
    const timer1 = moment(timer, 'YYYYMMDD, h:mm:ss a').fromNow();
    return timer1;
   },
    },
  };
  export default timezone;
