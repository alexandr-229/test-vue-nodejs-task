import { Injectable } from '@nestjs/common';
import {RequestBodyDto} from './dto/request.body.dto';
import {} from 'path';
const fs = require('fs')

@Injectable()
export class AppService {

    increment(dto: RequestBodyDto) {
        const result = +dto.firstNumber + +dto.secondNumber
        return { result }
    }

    decrement(dto: RequestBodyDto){
        const result = +dto.firstNumber - +dto.secondNumber
        return { result }
    }

    multiply(dto: RequestBodyDto){
        const result = +dto.firstNumber * +dto.secondNumber
        return { result }
    }

    divide(dto: RequestBodyDto){
        const result = +dto.firstNumber / +dto.secondNumber
        return { result }
    }
    
    createDataBase(data: string) {
        fs.mkdir('./data', () => {
            fs.writeFile('./data/data.json', `{"number": "${data}"}`, () => {})
        })
    }

    saveInDataBase(data: string){
        fs.writeFileSync('./data/data.json', )
    }

    getFromDataBase() {
        const result = fs.readFileSync('./data/data.json', 'utf8')
        return result
    }
}
