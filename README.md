👉 npm install @nestjs/mongoose mongoose

👉 npm i --save @nestjs/config
   ✅ sẽ cài đặt package @nestjs/config dùng để quản lý biến môi trường
    (environment variables) trong NestJS một cách tiện lợi, mạnh mẽ và có type support.

👉 nest g resource users --no-spec

👉 npm i --save class-validator class-transformer : app.useGlobalPipes(new ValidationPipe());

👉 npm i --save @nestjs/config

👉 npm install bcrypt , npm install --save-dev @types/bcrypt
   ✅ Để hashing password trong NestJS (thường dùng trong quá trình đăng ký và xác thực người dùng), bạn sử dụng thư viện

👉 npm install --save @nestjs/passport passport passport-local
   npm install --save-dev @types/passport-local
   npm install --save @nestjs/jwt passport-jwt
   npm install --save-dev @types/passport-jwt

👉 npm i uuid

👉 npm i dayjs

👉 npm install --save @nestjs-modules/mailer nodemailer handlebars
   npm install --save-dev @types/nodemailer

👉 npm i --save @nestjs/throttler : rate limiting

📌 Mapped types
  ✅ export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password', 'role'] as const)) {}
    👉 OmitType : Sử dụng utility OmitType từ @nestjs/mapped-types để kế thừa tất cả các trường từ CreateUserDto, trừ trường "password", "role".
  ✅ export class UpdateCatAgeDto extends PickType(CreateCatDto, ['age'] as const) {}
    👉 PickType : dùng để chọn (pick) một vài trường từ một DTO gốc.
  ✅ export class CreateCatDto extends IntersectionType(CatDto, BreedDto) {}
    👉 IntersectionType : dùng để kết hợp nhiều DTO lại thành một DTO mới bằng cách gộp tất cả các trường của chúng
📌JWT
  ✅ Header
  ✅ Payload
  ✅ Signature

📌Lifecycle
  ✅Client (HTTP Request)
        ⏬
  ✅Middleware : có thể log, kiểm tra token, ip , không có quyền truy cập DTO, validation
        ⏬
  ✅Guards (CanActivate) : Dùng để bảo vệ route, Kiểm tra JWT, vai trò (RoleGuard), Trả về true/false => cho phép/không cho phép đi tiếp
        ⏬
  ✅Interceptors(@UseInterceptors()) (Before) : Chạy trước và sau Controller, Thêm logic xử lý chung (log, cache...), Chỉnh sửa response trả về
        ⏬
  ✅Pipes (Validation, Transform) : Xử lý validation và transform dữ liệu đầu vào, Gắn ở DTO hoặc controller
        ⏬
  ✅Controller : Nơi xử lý request chính, Gọi service để thao tác logic , DB
        ⏬
  ✅Service (logic, DB, etc.) : Chứa business logic, gọi database, thao tác dữ liệu,
        ⏬
  ✅Controller (return response)
        ⏬
  ✅Interceptors (After)
        ⏬
  ✅Exception Filters (nếu có lỗi) : Xử lý lỗi toàn cục, Trả về message, status code, log lỗi tùy chỉnh
        ⏬
  ✅Response trả về Client
