module.exports = {
  port: 9000,
  log: {
    level: 'silly',
    disabled: false,
  },
  cors: {
    origins: ['http://localhost:5173', 'http://localhost:4173'],
    maxAge: 3 * 60 * 60,
  },
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      secret: 'somerandomsecretthatisverystrong',
      expirationInterval: 12 * 60 * 60 * 1000, // ms (1 hour)
      issuer: 'homecloud.be',
      audience: 'homecloud.be',
    },
  },
};