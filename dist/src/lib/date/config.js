"use strict";
Date.prototype.getWeek = function () {
    const date = new Date(this.valueOf());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};
