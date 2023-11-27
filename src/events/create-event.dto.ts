import { IsDateString, Length } from "class-validator";

export class CreateEventDto{
    @Length(5,255, {message: "Name length is wrong"})
    name: string;
    description: string;
    @IsDateString()
    when: string;
    address: string;
}