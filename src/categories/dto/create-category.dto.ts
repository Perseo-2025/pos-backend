import { IsString } from "class-validator";

export class CreateCategoryDto {

    @IsString({message:'El nombre debe de ser de tipo string'})
    name: string;

}
