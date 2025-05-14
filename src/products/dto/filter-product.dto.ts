import {  IsNumberString, IsOptional, IsString } from "class-validator";

export class FilterProductDto {
    @IsOptional()
    @IsNumberString({}, {message: 'El id debe de ser de tipo number'})
    search?: number;

    @IsOptional()
    @IsNumberString({}, {message: 'El id debe de ser de tipo number'})
    take?: number; //filter

    @IsOptional()
    @IsNumberString({}, {message: 'El id debe de ser de tipo number'})
    skip?: number; //filter

}