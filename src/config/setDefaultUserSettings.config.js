
export const setDefaultUserSettings = () => ({
    timeZone: 'Asia/Jerusalem',
    days: [
        { isToggledOn: true, day: 'Sunday', startTime: "09:00", endTime: "13:00" },
        { isToggledOn: true, day: 'Monday', startTime: "09:00", endTime: "13:00" },
        { isToggledOn: true, day: 'Tuesday', startTime: "09:00", endTime: "13:00" },
        { isToggledOn: true, day: 'Wednesday', startTime: "09:00", endTime: "13:00" },
        { isToggledOn: true, day: 'Thursday', startTime: "09:00", endTime: "13:00" },
        { isToggledOn: false, day: 'Friday', startTime: "09:00", endTime: "13:00" },
        { isToggledOn: false, day: 'Saturday', startTime: "09:00", endTime: "13:00" },
    ]
});
