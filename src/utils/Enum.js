const ttl = (arr, ...values) => arr
  .reduce(
    (str, curr, i) => `${str} ${
      typeof values[i] === 'function' ? values[i]() : values[i] || ''
    } ${curr}`,
    ''
  )
  .split(/[\s,]/)
  .map(s => s.trim())
  .filter(s => !!s);

const Enum = (...args) => {
  const arr = Array.isArray(args[0]) ? ttl(...args) : ttl([args.join(' ')]);

  return Object.freeze(arr.reduce((obj, key) => ({ ...obj, [key]: key }), {}));
};

export default Enum;
