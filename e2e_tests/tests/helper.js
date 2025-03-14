const loginWith = async (page, username, password) => {
  await page.goto('http://127.0.0.1:5173/login');
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const searchObject = async (page, type, searchedObject) => {
  await page.getByRole('link', { name: 'Search' }).click();
  await page.getByTestId(type).click();
  await page.getByTestId(`Search ${type}`).fill(searchedObject);
};

export { loginWith, searchObject };
