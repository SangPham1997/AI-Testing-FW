export const users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked:   { username: 'locked_out_user', password: 'secret_sauce' },
  problem:  { username: 'problem_user', password: 'secret_sauce' },
  invalid:  { username: 'invalid_user', password: 'wrong_password' },
} as const;

export const newPost = {
  title: 'foo',
  body: 'bar',
  userId: 1,
} as const;

export const newUser = {
  username: 'new_user',
  password: 'secret_sauce',
} as const;
