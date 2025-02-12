import { Input, Progress } from 'antd';
import { InputProps } from 'antd/lib/input';
import React, { useState } from 'react';

// 00-24    poor password
// 25-49    weak password
// 50-74    good password
// 75-100   strong password
// entropy source: https://www.baeldung.com/cs/password-entropy
export const calculateEntropy = (password: string) => {
  let charSetSize = 0;
  if (/[a-z]/.test(password)) charSetSize += 26;
  if (/[A-Z]/.test(password)) charSetSize += 26;
  if (/[0-9]/.test(password)) charSetSize += 10;
  if (/\W|_/.test(password)) charSetSize += 32;
  return password.length > 0 ? Math.log2(charSetSize ** password.length) : 0;
};

export const PasswordStrengthMeter = (props: InputProps) => {
  const [strength, setStrength] = useState(0);

  const getStrengthLevel = (entropy: number) => {
    if (entropy < 25) return 'poor';
    if (entropy < 50) return 'weak';
    if (entropy < 75) return 'good';
    return 'strong';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setStrength(calculateEntropy(newPassword));
    props.onChange?.(e);
  };

  const strengthLevel = getStrengthLevel(strength);
  const strengthPercent = Math.min((strength / 100) * 100, 100);
  const inputStrokeColor =
    strengthLevel === 'poor'
      ? '#ff4d4f'
      : strengthLevel === 'weak'
      ? '#faad14'
      : strengthLevel === 'good'
      ? '#52c41a'
      : '#1890ff';

  return (
    <div>
      <Input.Password {...props} onChange={handlePasswordChange} />
      <Progress
        data-testid={`level-${strengthLevel}`}
        percent={strengthPercent}
        status={strengthLevel === 'poor' ? 'exception' : 'active'}
        strokeColor={inputStrokeColor}
        showInfo={false}
      />
    </div>
  );
};
