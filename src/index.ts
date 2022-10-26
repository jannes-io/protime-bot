import fs from 'fs/promises';
import { promisify } from 'util';
import { exec as execCb } from 'child_process';

const exec = promisify(execCb);

interface Time {
  h: number;
  m: number;
}

let next: number;

const parseDec = (str: string) => parseInt(str, 10);
const parseTime = (str: string): Time => {
  const [h, m] = str.split(':').map(parseDec);
  return { h, m };
}
const timeToDate = (now: Date) => (time: Time) => {
  const d = new Date(now);
  d.setSeconds(0, 0);
  d.setMinutes(time.m);
  d.setHours(time.h);
  return d;
}

const printNext = (schedule: Date[], now: Date) => {
  const nextDay = new Date(schedule[0]);
  nextDay.setDate(now.getDate() + 1);
  console.log(`Next check-in/out at: ${schedule[next] || nextDay}`);
}

const run = async (checkInSchedule: string[][], discovery: boolean) => {
  setTimeout(() => run(checkInSchedule, false), 5000);

  const now = new Date();
  const days = checkInSchedule[now.getDay() - 1];
  if (days.length == 0) {
    return;
  }

  const schedule = days
    .map(parseTime)
    .map(timeToDate(now));

  const nextNext = schedule.findIndex((d) => d > now);
  if (discovery) {
    next = nextNext;
    printNext(schedule, now);
    return;
  }

  if (next === nextNext) {
    return;
  }
  next = nextNext;

  console.log('Checking in/out');
  try {
    await exec('npm run check-in');
  } catch (e) {
    console.error('Unable to check-in', e);
  }

  printNext(schedule, now);
};

fs.readFile('config.json').then((json) => {
  const config = JSON.parse(json.toString());
  if (!config.hasOwnProperty('checkInSchedule') || !Array.isArray(config.checkInSchedule)) {
    console.error('Malformed config file. Please check config.example.json');
    return;
  }

  run(config.checkInSchedule as string[][], true);
});