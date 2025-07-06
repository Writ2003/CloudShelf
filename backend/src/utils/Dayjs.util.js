import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import updateLocale from 'dayjs/plugin/updateLocale.js';

// Extend with plugins
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// Customize strings
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'Just now',
    m: '1 min ago',
    mm: '%d mins ago',
    h: '1 hr ago',
    hh: '%d hrs ago',
    d: '1 day ago',
    dd: '%d days ago',
    M: '1 mo ago',
    MM: '%d mos ago',
    y: '1 yr ago',
    yy: '%d yrs ago'
  }
});

export default dayjs;
