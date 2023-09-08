const login = {
  type: 'object',
  properties: {
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
      isNotEmpty: true,
      errorMessage: {
        isNotEmpty: 'Password is required',
      },
    },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};

export default login;