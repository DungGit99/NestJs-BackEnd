import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPasswordHelper } from 'src/helpers/util';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  // ✅ Tạo user mới
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto)
    return user
  }
  // ✅ Lấy danh sách user
  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }
   // ✅ Lấy user theo ID
  @Get(':id')
  async findOne(@Param('id') id:string){
    return this.usersService.findById(id)
  }
  // ✅ Cập nhật user
  @Put(':id')
  async update(@Param(':id') id:string, @Body() updateUserDto: UpdateUserDto ){
    return this.usersService.update(id, updateUserDto);
  }
   // ✅ Xoá user
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }
}
