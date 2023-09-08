const register = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      isNotEmpty: true,
      errorMessage: {
        isNotEmpty: 'Name is required',
      },
    },
    email: {
      type: 'string',
      isNotEmpty: true,
      format: 'email',
      errorMessage: {
        isNotEmpty: 'Email is required',
        format: 'Email is not valid',
      },
    },
    password: {
      type: 'string',
      minLength: 6,
      isNotEmpty: true,
      errorMessage: {
        isNotEmpty: 'Password is required',
        minLength: 'Password must be at least 6 characters',
      },
    },
  },
  required: ['name', 'email', 'password'],
  additionalProperties: false,
};

export default register;