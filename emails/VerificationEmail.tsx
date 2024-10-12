import * as React from 'react';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
  username, otp
}) => (
  <div>
    <h1>Welcome, {username}!</h1>
    <h6>your verification code is: {otp}!</h6>
  </div>
);