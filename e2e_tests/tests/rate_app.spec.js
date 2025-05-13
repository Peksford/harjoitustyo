const { test, expect, describe, beforeEach } = require('@playwright/test');
const { loginWith, searchObject } = require('./helper');

describe('Rate app', () => {
  beforeEach(async ({ page, request }) => {
    await page.waitForTimeout(3000);

    await request.post('http://127.0.0.1:3001/api/testing/reset');

    await request.post('http://127.0.0.1:3001/api/users', {
      data: {
        username: 'kayttaja',
        password: 'salasana',
      },
    });
    await page.goto('/login');
  });

  // test('front page can be opened', async ({ page }) => {
  //   await test.step('front page can be opened', async () => {
  //     await page.goto('/');

  //     const locator = await page.getByText('Let It Rate');
  //     await expect(locator).toBeVisible();
  //   });
  // });

  test('user can log in', async ({ page, request }) => {
    await test.step('user can log in', async () => {
      await loginWith(page, 'kayttaja', 'salasana');
      await page.waitForNavigation({ waitUntil: 'load' });
      await page.waitForSelector('text=Welcome kayttaja');
      const welcomeMessage = await page.getByText('Welcome kayttaja');

      await expect(page.getByText('Welcome kayttaja')).toBeVisible();
    });
    console.log('Logged in succesfully');
  });

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'kayttaja', 'wrong');

    const errorDiv = await page.locator('.error');
    await expect(errorDiv).toContainText('invalid username or password');
    await expect(errorDiv).toHaveCSS('background-color', 'rgb(255, 0, 0)');

    await expect(page.getByText('welcome kayttaja')).not.toBeVisible();
    console.log('login failed succesfully');
  });
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
    await page.getByRole('button', { name: 'Add' }).first().click();
    await expect(page.getByText('Abbey Road added on your list')).toBeVisible();

    await page.locator('#dropdown-secondary-button').click();

    await page.locator('text=My albums').click();
    await expect(page.getByText('The Beatles - Abbey Road')).toBeVisible();
    await expect(page.getByTestId('albumTest')).toBeVisible();
    console.log('Album added!');
  });

  test('a new movie can be added', async ({ page }) => {
    await searchObject(page, 'movie', 'Return of the Jedi');

    await page.waitForSelector('text=Return of the Jedi', {
      timeout: 10000,
    });
    await page.getByRole('button', { name: 'Add' }).first().click();
    await expect(
      page.getByText('Return of the Jedi added on your list')
    ).toBeVisible();

    await page.locator('#dropdown-secondary-button').click();

    await page.locator('text=My movies').click();

    await expect(
      page.getByText('Return of the Jedi', { exact: true })
    ).toBeVisible();
    await expect(page.getByTestId('movieTest')).toBeVisible();
    console.log('Movie added!');
  });

  // test('a new book can be added', async ({ page }) => {
  //   await searchObject(
  //     page,
  //     'book',
  //     "Harry Potter and the Philosopher's Stone"
  //   );

  //   await page.waitForSelector(
  //     "text=Harry Potter and the Philosopher's Stone",
  //     {
  //       timeout: 50000,
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
  //   console.log('Book added!');
  // });

  test('a new game can be added', async ({ page }) => {
    await searchObject(page, 'game', 'Rocket League');

    await page.waitForSelector('text=Rocket League', {
      timeout: 10000,
    });
    await page.getByRole('button', { name: 'Add' }).first().click();
    await expect(
      page.getByText('Rocket League added on your list')
    ).toBeVisible();

    await page.locator('#dropdown-secondary-button').click();

    await page.locator('text=My games').click();
    // await expect(page.getByRole('heading', { name: 'Games' })).toBeVisible();
    await expect(page.getByText('Rocket League')).toBeVisible();
    await expect(page.getByTestId('gameTest')).toBeVisible();
    console.log('Game added!');
  });

  test('album can be deleted', async ({ page }) => {
    await page.getByTestId('dropdown-list').click();
    await page.locator('text=My albums').click();

    await page.waitForSelector('text=The Beatles - Abbey Road', {
      timeout: 50000,
    });

    await page.getByTestId('albumTest').click();

    await expect(
      page.getByRole('heading', { name: 'The Beatles - Abbey Road' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'remove' }).click();
    await page.getByRole('button', { name: 'YES' }).click();

    await expect(
      page.getByText('Abbey Road was removed from your list')
    ).toBeVisible();
    console.log('Album deleted!');
  });

  test('movie can be deleted', async ({ page }) => {
    await page.getByTestId('dropdown-list').click();
    await page.locator('text=My movies').click();

    await page.waitForSelector('text=Return of the Jedi', {
      timeout: 50000,
    });

    await page.getByTestId('movieTest').click();
    await expect(
      page.getByRole('heading', { name: 'Return of the Jedi' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'remove' }).click();
    await page.getByRole('button', { name: 'YES' }).click();

    await expect(
      page.getByText('Return of the Jedi was removed from your list')
    ).toBeVisible();
    console.log('Movie deleted!');
  });

  // test('book can be deleted', async ({ page }) => {
  //   await page.getByRole('button', { name: 'kayttaja' }).click();
  //   await page.locator('text=My books').click();

  //   await page.waitForSelector(
  //     "text=Harry Potter and the Philosopher's Stone",
  //     {
  //       timeout: 100000,
  //     }
  //   );

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
  //   console.log('Book deleted!');
  // });

  test('game can be deleted', async ({ page }) => {
    await page.getByTestId('dropdown-list').click();
    await page.locator('text=My games').click();

    await page.waitForSelector('text=Rocket League', {
      timeout: 100000,
    });

    await page.getByTestId('gameTest').click();
    await expect(
      page.getByRole('heading', { name: 'Rocket League' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'remove' }).click();
    await page.getByRole('button', { name: 'YES' }).click();

    await expect(
      page.getByText('Rocket League was removed from your list')
    ).toBeVisible();
    console.log('Game deleted!');
  });

  test('user can be searched and followed', async ({ page, request }) => {
    // await request.post('http://127.0.0.1:3001/api/users', {
    //   data: {
    //     username: 'TestiKayttaja',
    //     password: 'salasana',
    //   },
    // });
    await searchObject(page, 'user', 'TestiKayttaja');

    await page.waitForSelector('text=TestiKayttaja', {
      timeout: 10000,
    });
    await page.getByRole('link', { name: 'TestiKayttaja' }).first().click();
    await expect(
      page.getByRole('heading', { name: 'TestiKayttaja', exact: true })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Follow' }).click();
    await expect(page.locator('text=Unfollow')).toBeVisible();

    await page.getByRole('link', { name: 'Followers' }).click();

    await expect(
      page.getByRole('listitem').getByRole('link', { name: 'kayttaja' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Unfollow' }).click();
    console.log('User followed!');
  });

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
});
