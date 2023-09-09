const addGame = {
  type: 'object',
  properties: {
    gameName: {
      type: 'string',
      isNotEmpty: true,
      errorMessage: {
        isNotEmpty: 'Email is required',
      },
    },
    reviewDescription: {
      type: 'string',
      isNotEmpty: false,
    },
  },
  required: ['gameName'],
  additionalProperties: false,
};

export default addGame;