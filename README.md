# webreg-to-calendar
A Firefox extension that converts your UCSD schedule into a calendar file for Google Calendar.  Switching between tabs to put in your schedule information is annoying, and ending the custom recurrence rules is downright painful, so with the click of a button this extension does all of that for you.

## How to use:
1. Navigate to your schedule at either MyTritonlink or WebReg
2. Click the add-on [logo](https://github.com/ParkerGreyAddison/webreg-to-calendar/tree/master/icons/ucsd-to-calendar.svg) to start the conversion
3. When the prompt pops up, click `Download Calendar` to save your file
4. Import into Google Calendar or iCalendar as desired!

You can click [here](https://support.google.com/calendar/answer/37118?hl=en#) for help importing into Google Calendar.

## What I learned:
I started this project with three goals in mind.
1. Write something somewhat complex JavaScript
2. Learn how to make a browser extension
3. Practice working through API documentation.

I believe I was successful with all three goals, since I now feel fairly confident in each area.  Working with webpages in JavaScript is really nice, the only issues I ran into was how to deal with the asynchronicity of JS when calling a function that depended on another's completion.  Creating the webextension was quite fun, and I hope I'll have the inspiration to make some more in the future.  As for getting comfortable with documentation, the [Firefox WebExtension API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions) and the [iCalendar documentation](https://icalendar.org/RFC-Specifications/iCalendar-RFC-5545/) both seemed daunting at first, but were actually very nice to work with once I had established a small degree of familiarity with their respective topics.