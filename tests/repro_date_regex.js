
const lower = "i'm headed to lagos jan 5 - 9";
// Regex from route.ts
const rangeMatch = lower.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}(?:st|nd|rd|th)?)\s*(?:-|to)\s*(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+)?(\d{1,2}(?:st|nd|rd|th)?)/i);

console.log("Input:", lower);
console.log("Match:", rangeMatch);

if (rangeMatch) {
    const startMonth = rangeMatch[1].charAt(0).toUpperCase() + rangeMatch[1].slice(1, 3);
    const startDay = rangeMatch[2].replace(/(st|nd|rd|th)/, '');

    let endMonth = startMonth;
    let endDay = rangeMatch[4].replace(/(st|nd|rd|th)/, '');

    if (rangeMatch[3]) {
        endMonth = rangeMatch[3].charAt(0).toUpperCase() + rangeMatch[3].slice(1, 3);
    }

    let dateInfo;
    if (startMonth === endMonth) {
        dateInfo = `${startMonth} ${startDay}-${endDay}`;
    } else {
        dateInfo = `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
    console.log("Result:", dateInfo);
} else {
    console.log("No match");
}

const lower2 = "aug 22 - 28";
const rangeMatch2 = lower2.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}(?:st|nd|rd|th)?)\s*(?:-|to)\s*(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+)?(\d{1,2}(?:st|nd|rd|th)?)/i);
console.log("\nInput:", lower2);
if (rangeMatch2) {
    const startMonth = rangeMatch2[1].charAt(0).toUpperCase() + rangeMatch2[1].slice(1, 3);
    const startDay = rangeMatch2[2].replace(/(st|nd|rd|th)/, '');
    let endMonth = startMonth;
    let endDay = rangeMatch2[4].replace(/(st|nd|rd|th)/, '');
    if (rangeMatch2[3]) endMonth = rangeMatch2[3].charAt(0).toUpperCase() + rangeMatch2[3].slice(1, 3);

    let dateInfo;
    if (startMonth === endMonth) dateInfo = `${startMonth} ${startDay}-${endDay}`;
    else dateInfo = `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    console.log("Result:", dateInfo);
} else {
    console.log("No match");
}
