import jwtDecode from 'jwt-decode';

import { JWTPayload } from 'shared/interfaces';
import { TokenService } from 'services/api';

export function isTokenValid(token: string) {
  try {
    const decoded_jwt: JWTPayload = jwtDecode<JWTPayload>(token);
    const current_time = Date.now().valueOf() / 1000; // in secs
    return decoded_jwt.exp > current_time;
  } catch (_) {
    return false;
  }
}

export function getSessionDuration(token: any): number {
    const decoded_jwt: JWTPayload = jwtDecode<JWTPayload>(token); 
    return decoded_jwt.expiresIn; //seconds
}

export function wasUserActiveDuringCurrentSession(token: string): boolean {
    try {
        const lastResponseTimeStamp = TokenService.getHttpResponseTimeStamp();
        const lastAccessDelay = (Date.now() - lastResponseTimeStamp) / 1000; //seconds
        return lastAccessDelay <  getSessionDuration(token);
    } catch (_) {
      return false;
    }
}

export function getSessionRemainingTimeBeforeExpiration(token: string) {
    try {
      const decoded_jwt: JWTPayload = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000; //seconds
      return Math.max(0, decoded_jwt.exp -currentTime); //seconds
    } catch (_) {
      return 0;
    }
}

export function isAutomaticSessionRenewalRequired(token: string) {
    const sessionDuration = getSessionDuration(token) / 1000; //seconds
    const remainingTime = getSessionRemainingTimeBeforeExpiration(token); //seconds
    return remainingTime < sessionDuration * 0.10 && wasUserActiveDuringCurrentSession(token);
}

