import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Observable, of } from 'rxjs';
import path = require('path');
import { join } from 'path';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      // console.log('req', req);
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename} ${extension}`);
    },
  }),
};

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  data = [];

  // @Post()
  //   return this.todoService.create(createTodoDto);
  // }
  @Get('file')
  findAllFile() {
    return this.data;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', storage))
  create(@Body() createTodoDto, @UploadedFile() file) {
    console.log({
      image: file.filename,
      skill: createTodoDto.skill,
    });
    // console.log(createTodoDto, file.filename);
    return '';
  }
  uploadFile(@UploadedFile() file): Observable<object> {
    return of({ imagePath: file.filename });
  }

  @Get('profile-image/:imagename')
  findProfileImage(
    @Param('imagename') imagename,
    @Res() res,
  ): Observable<object> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)),
    );
  }

  @Get()
  findAll() {
    return this.data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
