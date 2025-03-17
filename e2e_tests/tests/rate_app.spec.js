const { test, expect, describe, beforeEach } = require('@playwright/test');
const { loginWith, searchObject } = require('./helper');

describe('Rate app', () => {
  beforeEach(async ({ page, request }) => {
    let response = await request.post(
      'http://127.0.0.1:3001/api/testing/reset'
    );
    console.log('Reset response', await response.status());
    await request.post('http://127.0.0.1:3001/api/users', {
      data: {
        username: 'kayttaja',
        password: 'salasana',
      },
    });
    await page.goto('http://127.0.0.1:5173/login');
  });

  test('front page can be opened', async ({ page }) => {
    await test.step('front page can be opened', async () => {
      await page.goto('http://127.0.0.1:5173/kayttaja');

      const locator = await page.getByText(
        'kayttaja has not reviewed anything yet!'
      );
      await expect(locator).toBeVisible();
      await expect(page.getByText('albums')).toBeVisible();
    });
  });

  test('user can log in', async ({ page, request }) => {
    await test.step('user can log in', async () => {
      await loginWith(page, 'kayttaja', 'salasana');
      await page.waitForNavigation({ waitUntil: 'load' });
      await page.waitForSelector('text=Welcome kayttaja');
      const welcomeMessage = await page.getByText('Welcome kayttaja');
      console.log('Welcome message found:', welcomeMessage);
      await expect(page.getByText('Welcome kayttaja')).toBeVisible();
    });
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
      console.log(server.printHandlers());
      await searchObject(page, 'album', 'Abbey Road');

      await page.waitForSelector('text=The Beatles - Abbey Road', {
        timeout: 10000,
      });
      await page.getByRole('button', { name: 'Add' }).first().click();
      await expect(
        page.getByText('Abbey Road added on your list')
      ).toBeVisible();

      await page.locator('#dropdown-secondary-button').click();

      await page.locator('text=My albums').click();
      await expect(page.getByText('The Beatles - Abbey Road')).toBeVisible();
      await expect(page.getByTestId('albumTest')).toBeVisible();
    });

    // test('a new movie can be added', async ({ page }) => {
    //   await searchObject(page, 'movie', 'Return of the Jedi');

    //   await page.waitForSelector('text=Return of the Jedi', {
    //     timeout: 10000,
    //   });
    //   await page.getByRole('button', { name: 'Add' }).first().click();
    //   await expect(
    //     page.getByText('Return of the Jedi added on your list')
    //   ).toBeVisible();

    //   await page.locator('#dropdown-secondary-button').click();

    //   await page.locator('text=My movies').click();
    //   // await expect(
    //   //   page.getByRole('heading', { name: 'Movies/tv' })
    //   // ).toBeVisible();
    //   await expect(
    //     page.getByText('Return of the Jedi', { exact: true })
    //   ).toBeVisible();
    //   await expect(page.getByTestId('movieTest')).toBeVisible();
    // });

    // test('a new book can be added', async ({ page }) => {
    //   await searchObject(
    //     page,
    //     'book',
    //     "Harry Potter and the Philosopher's Stone"
    //   );

    //   await page.waitForSelector(
    //     "text=Harry Potter and the Philosopher's Stone",
    //     {
    //       timeout: 20000,
    //     }
    //   );
    //   await page.getByRole('button', { name: 'Add' }).first().click();
    //   await expect(
    //     page.getByText(
    //       "Harry Potter and the Philosopher's Stone added on your list"
    //     )
    //   ).toBeVisible();

    //   await page.locator('#dropdown-secondary-button').click();

    //   await page.locator('text=My books').click();
    //   // await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible();
    //   await expect(
    //     page.getByText("Harry Potter and the Philosopher's Stone")
    //   ).toBeVisible();
    //   await expect(page.getByTestId('bookTest')).toBeVisible();
    // });

    // test('a new game can be added', async ({ page }) => {
    //   await searchObject(page, 'game', 'Rocket League');

    //   await page.waitForSelector('text=Rocket League', {
    //     timeout: 10000,
    //   });
    //   await page.getByRole('button', { name: 'Add' }).first().click();
    //   await expect(
    //     page.getByText('Rocket League added on your list')
    //   ).toBeVisible();

    //   await page.locator('#dropdown-secondary-button').click();

    //   await page.locator('text=My games').click();
    //   // await expect(page.getByRole('heading', { name: 'Games' })).toBeVisible();
    //   await expect(page.getByText('Rocket League')).toBeVisible();
    //   await expect(page.getByTestId('gameTest')).toBeVisible();
    // });

    // test('user can be searched and followed', async ({ page }) => {
    //   await searchObject(page, 'user', 'JohnLennon');

    //   await page.waitForSelector('text=JohnLennon', {
    //     timeout: 10000,
    //   });
    //   await page.getByRole('link', { name: 'JohnLennon' }).first().click();
    //   await expect(
    //     page.getByRole('heading', { name: 'JohnLennon', exact: true })
    //   ).toBeVisible();
    //   await page.getByRole('button', { name: 'Follow' }).click();
    //   await expect(page.locator('text=Unfollow')).toBeVisible();

    //   await page.getByRole('link', { name: 'Followers' }).click();

    //   await expect(
    //     page.getByRole('listitem').getByRole('link', { name: 'kayttaja' })
    //   ).toBeVisible();

    //   await page.getByRole('button', { name: 'Unfollow' }).click();
    // });

    // test('album can be liked and is shown on the recommendations', async ({
    //   page,
    // }) => {
    //   await page.locator('text=albums').click();
    //   await page.getByTestId('albumTest').click();
    //   await expect(
    //     page.getByRole('heading', { name: 'The Beatles - Abbey Road' })
    //   ).toBeVisible();

    //   await page.getByTestId('heart').click();
    //   await page.getByTestId('homePage').click();
    //   await expect(
    //     page.getByRole('heading', { name: 'Recommendations' })
    //   ).toBeVisible();
    //   await expect(page.getByText('Abbey Road')).toBeVisible();
    // });

    // test('book can be liked and is shown on the recommendations', async ({
    //   page,
    // }) => {
    //   await page.locator('text=books').click();
    //   await page.getByTestId('bookTest').click();
    //   await expect(
    //     page.getByRole('heading', {
    //       name: "J. K. Rowling - Harry Potter and the Philosopher's Stone",
    //     })
    //   ).toBeVisible();

    //   await page.getByTestId('heart').click();
    //   await page.getByTestId('homePage').click();
    //   await expect(
    //     page.getByRole('heading', { name: 'Recommendations' })
    //   ).toBeVisible();
    //   await expect(
    //     page.getByText("J. K. Rowling - Harry Potter and the Philosopher's Stone")
    //   ).toBeVisible();
    // });

    // test('movie can be liked and is shown on the recommendations', async ({
    //   page,
    // }) => {
    //   await page.locator('text=movies').click();
    //   await page.getByTestId('movieTest').click();
    //   await expect(
    //     page.getByRole('heading', { name: 'Return of the Jedi' })
    //   ).toBeVisible();

    //   await page.getByTestId('heart').click();
    //   await page.getByTestId('homePage').click();
    //   await expect(
    //     page.getByRole('heading', { name: 'Recommendations' })
    //   ).toBeVisible();
    //   await expect(page.getByText('Return of the Jedi')).toBeVisible();
    // });

    // test('game can be liked and is shown on the recommendations', async ({
    //   page,
    // }) => {
    //   await page.locator('text=games').click();
    //   await page.getByTestId('gameTest').click();
    //   await expect(
    //     page.getByRole('heading', { name: 'Rocket League' })
    //   ).toBeVisible();

    //   await page.getByTestId('heart').click();
    //   await page.getByTestId('homePage').click();
    //   await expect(
    //     page.getByRole('heading', { name: 'Recommendations' })
    //   ).toBeVisible();
    //   await expect(page.getByText('Rocket League')).toBeVisible();
    // });

    // test('album can be deleted', async ({ page }) => {
    //   await page.getByRole('button', { name: 'kayttaja' }).click();
    //   await page.locator('text=My albums').click();
    //   await page.getByTestId('albumTest').click();

    //   await expect(
    //     page.getByRole('heading', { name: 'The Beatles - Abbey Road' })
    //   ).toBeVisible();

    //   await page.getByRole('button', { name: 'remove' }).click();
    //   await page.getByRole('button', { name: 'YES' }).click();

    //   await expect(
    //     page.getByText('Abbey Road was removed from your list')
    //   ).toBeVisible();
    // });

    // test('movie can be deleted', async ({ page }) => {
    //   await page.getByRole('button', { name: 'kayttaja' }).click();
    //   await page.locator('text=My movies').click();

    //   await page.getByTestId('movieTest').click();
    //   await expect(
    //     page.getByRole('heading', { name: 'Return of the Jedi' })
    //   ).toBeVisible();

    //   await page.getByRole('button', { name: 'remove' }).click();
    //   await page.getByRole('button', { name: 'YES' }).click();

    //   await expect(
    //     page.getByText('Return of the Jedi was removed from your list')
    //   ).toBeVisible();
    // });

    // test('book can be deleted', async ({ page }) => {
    //   await page.getByRole('button', { name: 'kayttaja' }).click();
    //   await page.locator('text=My books').click();

    //   await page.getByTestId('bookTest').click();
    //   await expect(
    //     page.getByRole('heading', {
    //       name: "J. K. Rowling - Harry Potter and the Philosopher's Stone",
    //     })
    //   ).toBeVisible();

    //   await page.getByRole('button', { name: 'remove' }).click();
    //   await page.getByRole('button', { name: 'YES' }).click();

    //   await expect(
    //     page.getByText(
    //       "Harry Potter and the Philosopher's Stone was removed from your list"
    //     )
    //   ).toBeVisible();
    // });

    // test('game can be deleted', async ({ page }) => {
    //   await page.getByRole('button', { name: 'kayttaja' }).click();
    //   await page.locator('text=My games').click();

    //   await page.getByTestId('gameTest').click();
    //   await expect(
    //     page.getByRole('heading', { name: 'Rocket League' })
    //   ).toBeVisible();

    //   await page.getByRole('button', { name: 'remove' }).click();
    //   await page.getByRole('button', { name: 'YES' }).click();

    //   await expect(
    //     page.getByText('Rocket League was removed from your list')
    //   ).toBeVisible();
    // });
  });
});
