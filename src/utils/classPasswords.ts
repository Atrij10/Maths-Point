// Class passwords for student access
export const CLASS_PASSWORDS = {
  '9': 'triangles',
  '10': 'trigonometry', 
  '11': 'parabola',
  '12': 'integration'
} as const;

// Admin password
export const ADMIN_PASSWORD = 'Punyatoa@15';

// Validate class password
export const validateClassPassword = (classNumber: string, password: string): boolean => {
  return CLASS_PASSWORDS[classNumber as keyof typeof CLASS_PASSWORDS] === password;
};

// Validate admin password
export const validateAdminPassword = (password: string): boolean => {
  return ADMIN_PASSWORD === password;
};

// Get password hint for class
export const getPasswordHint = (classNumber: string): string => {
  const hints = {
    '9': 'Format: class[number]math[year]',
    '10': 'Format: class[number]math[year]',
    '11': 'Format: class[number]math[year]',
    '12': 'Format: class[number]math[year]'
  };
  
  return hints[classNumber as keyof typeof hints] || 'Contact your teacher for the password';
};