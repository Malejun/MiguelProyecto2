export const Selector = {
  BAD_INPUT: "badInput",
  WRONG_CRED: "wrongCredentials",
  UNAUTHORIZED: "unauthorized",
  NOT_FOUND: "notFound",
  BAD_ERROR: "badError",
};

const errors = {
  [Selector.WRONG_CRED]: {
    statusCode: 400,
    message: "incorrect credentials",
  },
  [Selector.BAD_INPUT]: {
    statusCode: 400,
    message: "incorrect input data",
  },
  [Selector.UNAUTHORIZED]: {
    statusCode: 400,
    message: "unauthorized",
  },
  [Selector.NOT_FOUND]: {
    statusCode: 404,
    message: "resource not found",
  },
  [Selector.BAD_ERROR]: {
    statusCode: 500,
    message: "something went wrong",
  },
};

export default class CError extends Error {
  constructor(errorType, customStatusCode = 418) {
    super("");

    this.customCode = customStatusCode; //418
    const { statusCode, message } = this._getError(errorType);
    this.statusCode = statusCode;
    this.message = message;
  }

  _getError(errorType = Selector.BAD_ERROR) {
    return errors[errorType] ?? this._getCustomMsg(errorType);
  }

  _getCustomMsg(message) {
    return { statusCode: this.customCode, message };
  }
}
