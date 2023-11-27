import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, ParseIntPipe, ValidationPipe } from "@nestjs/common";
import { CreateEventDto } from './create-event.dto'
import { UpdateEventDto } from "./update-event.dto";
import { Event } from './event.entity'
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Controller('/events')
export class EventsController{
    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event>
    ){}

    @Get()
    async findAll(){
        return await this.repository.find();
    }
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id){
        return await this.repository.findOne(id);;
    }
    
    @Post()
    async create(@Body(new ValidationPipe({ groups: ['create']})) input: CreateEventDto){
        return await this.repository.save({
            ...input,
            when: new Date(input.when),
        });
    }

    @Patch(':id')
    async update(@Param('id') id, @Body(new ValidationPipe({groups: ['update']})) input: UpdateEventDto){
        var entity = await this.repository.findOne(id);
        entity = {
            ...entity,
            ...input,
            when: input.when ? new Date(input.when) : entity.when
        }
        return await this.repository.save(entity);
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id){
        const event = await this.repository.findOne(id);
        await this.repository.remove(event);
        
    }
}