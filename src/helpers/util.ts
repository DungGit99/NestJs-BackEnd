import * as bcrypt from 'bcrypt';

// rounds (số vòng mã hóa): số càng lớn thì mã hóa càng an toàn nhưng cũng càng chậm. Mặc định nên dùng 10.
export const hashPasswordHelper = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePasswordHelper = async (
  plainPassword: string,
  hashPassword: string,
) => {
  try {
    return await bcrypt.compare(plainPassword, hashPassword);
  } catch (error) {
    console.log(error);
  }
};
