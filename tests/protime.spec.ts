import * as fs from 'fs/promises';
import fetch from 'node-fetch';
import { expect, test } from '@playwright/test';

type Headers = Record<string, string>;

interface Event {
  label: string;
}

interface Day {
  isCurrentDay: boolean;
  isPublicHoliday: boolean;
  schedule: object | null;
  calendarDayEvents: Event[];
}

interface Week {
  days: Day[]
}

interface Schedule {
  weeks: Week[];
}

const getJson = async (url: string, init: any) => {
  const response = await fetch(url, init);
  return (await response.json()) as any;
}

const getUserId = async (headers: Headers) => {
  const userInfo = await getJson('https://ac-systems.myprotime.eu/bff/calendar/userinfo', { headers });
  return userInfo.id;
}

const getSchedule = (headers: Headers, userId: number): Promise<Schedule> => {
  return getJson(`https://ac-systems.myprotime.eu/bff/calendar/month/${userId}?poll=0`, { headers });
}

const findToday = (schedule: Schedule) => {
  for (const week of schedule.weeks) {
    for (const day of week.days) {
      if (day.isCurrentDay) {
        return day;
      }
    }
  }
  return null;
}

const checkInRequired = (today: Day) => {
  const isWorkingDay = today.schedule !== null && !today.isPublicHoliday;
  if (!isWorkingDay) {
    return false;
  }

  if (today.calendarDayEvents.length === 0) {
    return true;
  }

  return today.calendarDayEvents.find((event) => event.label === 'Prestatie') !== undefined;
}

test('protime check-in', async ({ page }) => {
  const configRaw = await fs.readFile('config.json');
  const config = JSON.parse(configRaw.toString());
  const { email, password, tenant } = config;

  await page.goto(`https://${tenant}.myprotime.eu/`);

  // Log-in
  await expect(page).toHaveURL(/^https?:\/\/authentication.+/);

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByText('Let me in').click();

  const tokenPromise = new Promise<Headers>((resolve) => {
    page.on('response', async (e) => {
      if (e.url().includes('api/auth/token')) {
        const Authorization = (await e.body()).toString();
        const Cookie = await e.request().headerValue('Cookie');
        resolve({ Authorization, Cookie });
      }
    });
  });

  await expect(page).toHaveURL(new RegExp(`https://${tenant}.myprotime.eu.+`));

  // Verify check-in required
  const headers = await tokenPromise;
  const userId = await getUserId(headers);
  const schedule = await getSchedule(headers, userId);
  const today = findToday(schedule);

  if (checkInRequired(today)) {
    // Check-in
    const checkinBtn = page.locator('[data-testid="clockingWidget_clockInOutBtn"]');

    if (config.dev === true) {
      await expect(checkinBtn).toBeVisible();
    } else {
      await checkinBtn.click();
    }
  }
});
