export interface JwtPayload {
  sub: string; // ID của user
  email: string; // Email người dùng
  codeId: string; // Mã code phục vụ cho mục đích xác thực (ex: reset password)
  codeExpired: string; // Thời điểm hết hạn code (ISO date string)
  iat: number; // Issued At - thời điểm tạo token (Unix timestamp)
  exp: number; // Expiration Time - thời điểm hết hạn token (Unix timestamp)
}
