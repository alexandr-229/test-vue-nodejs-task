import { Body, Controller, Get, Post, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestBodyDto } from './dto/request.body.dto';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
  
    @Post('increment')
    increment(@Body() dto: RequestBodyDto) {
        return this.appService.increment(dto)
    }
    
    @Post('decrement')
    decrement(@Body() dto: RequestBodyDto){
        return this.appService.decrement(dto)
    }

    @Post('multiply')
    multiply(@Body() dto: RequestBodyDto){
        return this.appService.multiply(dto)
    }

    @Post('divide')
    divide(@Body() dto: RequestBodyDto){
        return this.appService.divide(dto)
    }

    @Post('undo')
    undo(@Body() dto: {number: number}){
        this.appService.createDataBase(dto.number.toString())
        return 0
    }

    @Get('redo')
    redo(){
        try {
            const result = this.appService.getFromDataBase()
            return result
        } catch(e) {
            throw new HttpException('Что пошло не так. Возможно файл ещё не создан', 404)
        }
    }
}
