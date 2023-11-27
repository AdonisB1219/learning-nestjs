import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode } from "@nestjs/common";
import { CreateEventDto } from './create-event.dto'
import { UpdateEventDto } from "./update-event.dto";
import { Event } from './event.entity'

@Controller('/events')
export class EventsController{

    private events: Event[] = [];
import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode } from "@nestjs/common";
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
    async findOne(@Param('id') id){
        return await this.repository.findOne(id);;
    }
    
    @Post()
    async create(@Body() input: CreateEventDto){
        return await this.repository.save({
            ...input,
            when: new Date(input.when),
        });
    }

    @Patch(':id')
    async update(@Param('id') id, @Body() input: UpdateEventDto){
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
    @Get()
    findAll(){
        return [
            {id: 1, name: 'First event'},
            {id: 2, name: 'Second event'}
        ]
    }
    @Get(':id')
    findOne(@Param('id') id){
        const event = this.events.find(event => event.id === parseInt(id));
        return event;
    }
    
    @Post()
    create(@Body() input: CreateEventDto){
        const event = {
            ...input,
            when: new Date(input.when),
            id: this.events.length + 1
        }
        return event;
    }

    @Patch(':id')
    update(@Param('id') id, @Body() input: UpdateEventDto){
        const index = this.events.findIndex(event => event.id === parseInt(id));
        this.events[index] = {
            ...this.events[index],
            ...input,
            when: input.when ? new Date(input.when) : this.events[index].when
        }
        return this.events[index];
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id') id){
        this.events = this.events.filter(event => event.id != parseInt(id));
        
    }
}
