import * as moment from 'moment';

const timezone = {
    methods: {
      convertToUTC(date) {
        const UTCDate = moment.utc(date).format();
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
      dashboardTimer(orderTime) {
        const localTime = this.convertToLocalTime(orderTime);
        const timer = moment(localTime).toDate();
        const now = moment(new Date());
        if (moment.duration(now.diff(timer)).asHours() <= 24) {
          const timer1 = moment(timer, 'YYYYMMDD, h:mm:ss a').fromNow();
          return timer1;
        } else {
          const timer1 = moment(timer).format('ddd, Do MMM YYYY, hh:mm A');
          return timer1;
        }
      },
    },
  };
  export default timezone;
