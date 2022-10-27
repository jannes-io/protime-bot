## Protime bot

For those pesky authoritarian companies that don't trust their employees to work the correct hours and where "attendance" is a good measure for quality/quantity of work completed.

For any managers reading this, this was *totally* just an *educational* script and is **absolutely not** being used for real 👀.

The real motivation was simply laziness because working on this script for a few hours definitely pays off for the few seconds per day it takes to check in manually 😅. 

### Usage

#### Installation
```
git clone https://github.com/jannes-io/protime-bot.git
```
#### Configuration
Copy `config.example.json` to `config.json` and modify to your needs.

- `dev`: if set to `true` it will skip the actual check in/out click
- `tenant`: found in the URL of your protime instance, for example `https://my-company.myprotime.eu/` would be `my-company`
- `email`: Email used to log in
- `password`: Password used to log in
- `checkInSchedule`: list of days, starting at Sunday, an empty list means no check-in/out will be performed on that day, for example:
  - ```
    [], // sunday
    ["8:00", "12:00", "12:30", "16:45"], // monday
    ["8:00", "12:00", "12:30", "16:45"], // tuesday
    ["8:00", "12:00", "12:30", "16:45"], // wednesday
    ["8:00", "12:00", "12:30", "16:45"], // thursday
    ["8:00", "12:00", "12:30", "16:15"], // friday
    [] // saturday
    ```

#### Usage

Manually:
```
npm install
npx playwright install
npm run start
```

Using docker:
```
docker-compose up -d
```

#### Development usage
[!] Add `"dev": true` to your `config.json`, this will prevent the playwright test from actually pressing the check-in button.

For the scheduling script (anything in `./src`):
```
npm run watch
```

For the playwright test (anything in `./tests`, no watcher here to avoid unwanted check-ins):
```
npm run check-in
```
