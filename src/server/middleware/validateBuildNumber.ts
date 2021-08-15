import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED, FORBIDDEN } from 'http-status-codes';
import env from '@app/common/config/env';

export const validateBuildNumber = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isIOSClient = /Darwin/.test(req.headers['user-agent']);
  const isAndroidClient = /Dalvik/.test(req.headers['user-agent']);

  const [android_build_number, android_version] =
    env.android_build_number.split(',');
  const [ios_build_number, ios_version] = env.ios_build_number.split(',');

  if (isAndroidClient) {
    if (!req.get('x-build-number'))
      return res.jSend.error(null, 'Missing required header', FORBIDDEN);
    const buildNumber = Number(req.get('x-build-number'));

    if (buildNumber < Number(android_build_number))
      return res.jSend.error(
        null,
        `Please update your app to v${android_version}`,
        FORBIDDEN
      );
  }

  if (isIOSClient) {
    if (!req.get('x-build-number'))
      return res.jSend.error(null, 'Missing required header', UNAUTHORIZED);
    const buildNumber = Number(req.get('x-build-number'));

    if (buildNumber < Number(ios_build_number))
      return res.jSend.error(
        null,
        `Please update to v${ios_version} from the appstore`,
        UNAUTHORIZED
      );
  }

  next();
};
