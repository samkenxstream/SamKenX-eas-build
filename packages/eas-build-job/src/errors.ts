import { BuildPhase } from './logs';

export enum ErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_FASTLANE_ERROR = 'EAS_BUILD_UNKNOWN_FASTLANE_ERROR',
  UNKNOWN_GRADLE_ERROR = 'EAS_BUILD_UNKNOWN_GRADLE_ERROR',
  BUILD_TIMEOUT_ERROR = 'EAS_BUILD_TIMEOUT_ERROR',
}

export interface ExternalBuildError {
  errorCode: string;
  message: string;
  docsUrl?: string;
}

interface BuildErrorDetails {
  errorCode: string;
  userFacingMessage: string;
  userFacingErrorCode: string;
  docsUrl?: string;
  innerError?: Error;
  buildPhase?: BuildPhase;
}

export class BuildError extends Error {
  public errorCode: string;
  public userFacingMessage: string;
  public userFacingErrorCode: string;
  public docsUrl?: string;
  public innerError?: Error;
  public buildPhase?: BuildPhase;

  constructor(message: string, details: BuildErrorDetails) {
    super(message);
    this.errorCode = details.errorCode;
    this.userFacingErrorCode = details.userFacingErrorCode;
    this.userFacingMessage = details.userFacingMessage;
    this.docsUrl = details.docsUrl;
    this.innerError = details.innerError;
    this.buildPhase = details.buildPhase;
  }
  public format(): ExternalBuildError {
    return {
      errorCode: this.userFacingErrorCode,
      message: this.userFacingMessage,
      docsUrl: this.docsUrl,
    };
  }
}

export class UserFacingError extends Error {
  constructor(public errorCode: string, public message: string, public docsUrl?: string) {
    super(message);
  }
}

export class UnknownError extends UserFacingError {
  constructor() {
    super(ErrorCode.UNKNOWN_ERROR, 'Unknown error. See logs for more information.');
  }
}

export class UnknownBuildError extends BuildError {
  constructor() {
    const errorCode = ErrorCode.UNKNOWN_ERROR;
    const message = 'Unknown error. See logs for more information.';
    super(message, {
      errorCode,
      userFacingMessage: message,
      userFacingErrorCode: errorCode,
    });
  }
}

export class CredentialsDistCertMismatchError extends UserFacingError {
  constructor(message: string) {
    super('EAS_BUILD_CREDENTIALS_DIST_CERT_MISMATCH', message);
  }
}
