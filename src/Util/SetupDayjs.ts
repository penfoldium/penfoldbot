import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
