const { test, expect, describe, beforeEach } = require('@playwright/test');
const { loginWith, searchObject } = require('./helper');

describe('Rate app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');
    await request.post('http://localhost:3001/api/users', {
      data: {
        username: 'kayttaja',
        password: 'salasana',
      },
    });
    await page.goto('http://localhost:5173/login');
  });

  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173/kayttaja');

    const locator = await page.getByText(
      'kayttaja has not reviewed anything yet!'
    );
    await expect(locator).toBeVisible();
    await expect(page.getByText('albums')).toBeVisible();
  });
  test('user can log in', async ({ page }) => {
    await loginWith(page, 'kayttaja', 'salasana');
    await expect(page.getByText('Welcome kayttaja')).toBeVisible();
  });
  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'kayttaja', 'wrong');

    const errorDiv = await page.locator('.error');
    await expect(errorDiv).toContainText('invalid username or password');
    await expect(errorDiv).toHaveCSS('background-color', 'rgb(255, 0, 0)');

    await expect(page.getByText('welcome kayttaja')).not.toBeVisible();
  });
  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'kayttaja', 'salasana');
      await expect(page.getByText('Welcome kayttaja')).toBeVisible();
    });

    test('a new album can be added and is on My albums-list', async ({
      page,
    }) => {
      await searchObject(page, 'album', 'Abbey Road');

      await page.waitForSelector('text=The Beatles - Abbey Road', {
        timeout: 10000,
      });
      await page
        .getByRole('button', { name: 'Add to my list' })
        .first()
        .click();
      await expect(
        page.getByText('Abbey Road added on your list')
      ).toBeVisible();

      await page.locator('#dropdown-secondary-button').click();

      await page.locator('text=My albums').click();
      await expect(page.getByRole('heading', { name: 'Albums' })).toBeVisible();
      await expect(page.getByTestId('albumTest')).toBeVisible();
    });

    test('a new movie can be added', async ({ page }) => {
      await searchObject(page, 'movie', 'Return of the Jedi');

      await page.waitForSelector('text=Return of the Jedi', {
        timeout: 10000,
      });
      await page
        .getByRole('button', { name: 'Add to my list' })
        .first()
        .click();
      await expect(
        page.getByText('Return of the Jedi added on your list')
      ).toBeVisible();

      await page.locator('#dropdown-secondary-button').click();

      await page.locator('text=My movies').click();
      await expect(
        page.getByRole('heading', { name: 'Movies/tv' })
      ).toBeVisible();
      await expect(page.getByTestId('movieTest')).toBeVisible();
    });

    test('a new book can be added', async ({ page }) => {
      await searchObject(
        page,
        'book',
        "Harry Potter and the Philosopher's Stone"
      );

      await page.waitForSelector(
        "text=Harry Potter and the Philosopher's Stone",
        {
          timeout: 20000,
        }
      );
      await page
        .getByRole('button', { name: 'Add to my list' })
        .first()
        .click();
      await expect(
        page.getByText(
          "Harry Potter and the Philosopher's Stone added on your list"
        )
      ).toBeVisible();

      await page.locator('#dropdown-secondary-button').click();

      await page.locator('text=My books').click();
      await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible();
      await expect(page.getByTestId('bookTest')).toBeVisible();
    });
    test('a new game can be added', async ({ page }) => {
      await searchObject(page, 'game', 'Rocket League');

      await page.waitForSelector('text=Rocket League', {
        timeout: 10000,
      });
      await page
        .getByRole('button', { name: 'Add to my list' })
        .first()
        .click();
      await expect(
        page.getByText('Rocket League added on your list')
      ).toBeVisible();

      await page.locator('#dropdown-secondary-button').click();

      await page.locator('text=My games').click();
      await expect(page.getByRole('heading', { name: 'Games' })).toBeVisible();
      await expect(page.getByTestId('gameTest')).toBeVisible();
    });

    test('user can be searched', async ({ page }) => {
      await searchObject(page, 'user', 'PekkisBoi');

      await page.waitForSelector('text=PekkisBoi', {
        timeout: 10000,
      });
      await page.getByRole('link', { name: 'PekkisBoi' }).first().click();
      await expect(page.getByText('PekkisBoi')).toBeVisible();
    });

    // test('Added album is on own list', async ({ page }) => {
    //   await page.locator('#dropdown-secondary-button').click();

    //   await page.locator('text=My albums').click();
    //   await expect(page.getByRole('heading', { name: 'Albums' })).toBeVisible();
    //   // await expect(page.getByTestId('albumTest')).toBeVisible();
    // });
  });
});
