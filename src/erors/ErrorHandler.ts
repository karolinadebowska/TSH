import { Response } from 'express'
import { ValidationError } from 'express-json-validator-middleware'
import { ApiError, HttpCode } from "./ApiError"

class ErrorHandler {

  public handleError(e: Error, response: Response): void {
    if (this.isTrustedError(e))
      this.handleTrustedError(e as ApiError, response)
    else if (e instanceof ValidationError)
      response.status(400).json({ message: this.getMessageValidationError(e) })
    else {
      this.handleCriticalError(e, response)
    }
  }

  private isTrustedError(e: Error): boolean {
    if (e instanceof ApiError)
      return true
    return false
  }

  private getMessageValidationError(e: ValidationError): string {
    if (e.validationErrors.body) {
      const firstErr = e.validationErrors.body[0]
      return `${firstErr.instancePath.substring(1)} ${firstErr.message}`
    }
    if (e.validationErrors.query) {
      const firstErr = e.validationErrors.query[0]
      return `${firstErr.instancePath.substring(1)} ${firstErr.message}`
    }
    return e.message
  }

  private handleTrustedError(error: ApiError, response: Response): void {
    response.status(error.status).json({ message: error.message })
  }

  private handleCriticalError(error: Error, response: Response): void {
    response.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' })
  }

}
export const errorHandler = new ErrorHandler()