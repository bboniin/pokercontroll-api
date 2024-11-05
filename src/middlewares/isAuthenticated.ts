import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken'
import authConfig from "./../utils/auth"

interface Payload {
  sub: string;
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {

  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const [, token] = authToken.split(' ');

  try {

    const data = verify(
      token,
      authConfig.jwt.secret,
    ) as Payload
    
    req.user_id = data.sub;
    req.club_id = data["club_id"];
    req.user_type = data["user_type"];

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Internal server Error' });
  }

  return next();
}
