export enum HttpCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

interface ApiErrorArgs {
  name?: string
  status: HttpCode
  message: string
}

export class ApiError extends Error {
  public readonly name: string
  public readonly status: HttpCode

  constructor(args: ApiErrorArgs) {
    super(args.message)

    this.name = args.name || this.constructor.name
    this.status = args.status
  }
}