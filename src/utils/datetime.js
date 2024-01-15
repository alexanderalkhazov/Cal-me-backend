import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export function main(offsetedDate, availabilitySettings, duration, bookings) {

    const remainingDatesInUtc = getRemianingDatesInUTC(offsetedDate);

    const availabilitySettingsInUtc = convertAvailabilitySettingsToUtc(availabilitySettings);

    const daysByUserSettings = getDaysByUserSettings(remainingDatesInUtc, availabilitySettingsInUtc);

    const slotsInUtc = generateTimeSlots(daysByUserSettings, duration);

    const availableSlots = getAvailableSlots(slotsInUtc, bookings);

    return availableSlots;
}


function getAvailableSlots(slots, bookings) {
    const bookedDates = new Set(bookings.map(booking => dayjs(booking.date).toISOString()));
    const groupedAvailableSlots = slots.map(({ date, slots: slotTimes }) => {
        const availableSlots = slotTimes.filter(slotTime => !bookedDates.has(dayjs(slotTime).toISOString()));
        return {
            date: date.toISOString().split('T')[0],
            slots: availableSlots.map(slotTime => new Date(slotTime))
        };
    });
    return groupedAvailableSlots;
}

function convertAvailabilitySettingsToUtc(availabilitySettings) {
    const convertedSettings = {
        timezone: availabilitySettings.timeZone,
        days: availabilitySettings.days.map(daySetting => {
            const { day, startTime, endTime } = daySetting;
            const startDateTimeUtc = dayjs(`1970-01-01T${startTime}:00`).utc();
            const endDateTimeUtc = dayjs(`1970-01-01T${endTime}:00`).utc();
            return {
                day,
                startTime: startDateTimeUtc.format('HH:mm'),
                endTime: endDateTimeUtc.format('HH:mm'),
                _id: daySetting._id,
                isToggledOn: daySetting.isToggledOn
            };
        })
    };
    return convertedSettings;
}

function generateTimeSlots(daysByUserSettings, eventDuration) {
    return daysByUserSettings.map(({ date, daySetting }) => {
        const { startTime, endTime } = daySetting;
        const startDateTime = dayjs(`${date.toISOString().split('T')[0]}T${startTime}:00.000Z`);
        const endDateTime = dayjs(`${date.toISOString().split('T')[0]}T${endTime}:00.000Z`);
        const slots = generateSlots(startDateTime, endDateTime, eventDuration);
        return {
            date
            , slots
        };
    });
}

function generateSlots(startDateTime, endDateTime, eventDuration) {
    const slots = [];
    let currentSlot = startDateTime;

    while (currentSlot.isBefore(endDateTime) || currentSlot.isSame(endDateTime)) {
        slots.push(currentSlot.toISOString());
        currentSlot = currentSlot.add(eventDuration, 'minutes');
    }

    return slots;
}

function getDaysByUserSettings(remainingDatesInUtc, availabilitySettings) {
    return remainingDatesInUtc
        .map(date => {
            const dayValue = dayjs(date).day();
            const dayName = getDay(dayValue);
            const daySetting = getDaySetting(availabilitySettings, dayName);

            return {
                date,
                daySetting
            };
        })
        .filter(item => item.daySetting && item.daySetting.isToggledOn);
}

function getDaySetting(availabilitySettings, dayName) {
    return availabilitySettings.days.find(day => day.day === dayName);
}

function getDay(dayValue) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayValue];
}

function getRemianingDatesInUTC(offsetedDate) {
    const startDate = dayjs.utc(offsetedDate);
    const endOfMonth = startDate.endOf('month');
    const remainingDates = [];
    let currentDay = startDate;
    while (currentDay.isBefore(endOfMonth) || currentDay.isSame(endOfMonth, 'day')) {
        const d = new Date(currentDay);
        remainingDates.push(d);
        currentDay = currentDay.add(1, 'day');
    }
    return remainingDates;
}
