module.exports = (length, options = null) => {
  let schema = '';

  if (options?.uppercase ?? true) schema += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options?.lowercase ?? true) schema += 'abcdefghijklmnopqrstuvwxyz';
  if (options?.number ?? true) schema += '0123456789';

  let unique = '';
  let i = 0;

  while (i < length) {
    unique += schema.charAt(Math.floor(Math.random() * schema.length));
    i += 1;
  }

  return unique;
};
