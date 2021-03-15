import moment from "moment";
moment.locale("id");

export function startOfMonth() {
    const options = "YYYY-MM-DD hh:mm";
    const startOfMonth = moment()
        .clone()
        .startOf("month")
        .format(options);

    return startOfMonth;
}

export function endOfMonth() {
    const options = "YYYY-MM-DD hh:mm";
    const endOfMonth = moment()
        .clone()
        .endOf("month")
        .format(options);

    return endOfMonth;
}

export function toJSDate(value) {
    const options = "YYYY-MM-DD HH:mm:ss";
    if (value.seconds) {
        return String(moment(value.seconds * 1000).format(options));
    } else {
        return String(moment(value).format(options));
    }
}

export function toNormalDate(value) {
    const options = "DD-MM-yyyy";
    if (value.seconds) {
        return String(moment(value.seconds * 1000).format(options));
    } else {
        return String(moment(value).format(options));
    }
}

export function toReverseNormalDate(value) {
    const options = "yyyy-MM-DD";
    if (value.seconds) {
        return String(moment(value.seconds * 1000).format(options));
    } else {
        return String(moment(value).format(options));
    }
}

export function toCollectionDate(value) {
    const options = "yyyyMMDD";
    if (value.seconds) {
        return String(moment(value.seconds * 1000).format(options));
    } else {
        return String(moment(value).format(options));
    }
}

export function toTime(value) {
    const options = "HH:mm";
    if (value.seconds) {
        return String(moment(value.seconds * 1000).format(options));
    } else {
        return String(moment(value).format(options));
    }
}

export function toDayDateMonth(value) {
    const options = "dddd, DD MMMM";
    if (value.seconds) {
        return String(moment(value.seconds * 1000).format(options));
    } else {
        return String(moment(value).format(options));
    }
}

export function toDifferHour(start, end) {
    let isFirestoreTimestamp = start && start.seconds != null;
    let startTime = moment(start);
    let endTime = moment(end);

    if (isFirestoreTimestamp) {
        startTime = moment(start.seconds * 1000);
        endTime = moment(end.seconds * 1000);
    }

    let differHour = endTime.diff(startTime, "hours");

    return differHour;
}

// export function toInputDate(value) {
//   const options = 'yyyy-MM-DD'
//   if(value.seconds) {
//     return String(moment(value.seconds * 1000).format(options))
//   } else {
//     return String(moment(value).format(options))
//   }
// }

// export function toCountdown(value) {
//   let start = moment ()
//   let end

//   if(value.seconds) {
//     end = moment(value.seconds * 1000)
//   } else {
//     end = moment(value)
//   }

//   const countdown = {
//     days:  end.diff(start, 'days'),
//     hours: end.diff(start, 'hours'),
//     minutes: end.diff(start, 'minutes') % 60,
//     seconds: end.diff(start, 'seconds') % 60,
//   }

//   return countdown

// }

// export function toObjectDate(value) {
//   let date
//   if(value.seconds) {
//     date = moment(value.seconds * 1000)
//   } else {
//     date = moment(value)
//   }

//   return {
//     day: date.format('DD'),
//     month: date.format('MMMM'),
//     year: date.format('yyyy'),
//   }
// }

// export function toDate(value) {
//   const options = 'DD . MM . yyyy'
//   if(value.seconds) {
//     return String(moment(value.seconds * 1000).format(options))
//   } else {
//     return String(moment(value).format(options))
//   }
// }

// export function toUSDate(value) {
//   const options = 'MMMM DD, yyyy'
//   if(value.seconds) {
//     return String(moment(value.seconds * 1000).format(options))
//   } else {
//     return String(moment(value).format(options))
//   }
// }

// export function fromNow(value) {
//   if(value.seconds) {
//     return String(moment(value.seconds * 1000).fromNow())
//   } else {
//     return String(moment(value).fromNow())
//   }
// }
