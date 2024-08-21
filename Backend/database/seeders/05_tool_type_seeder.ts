import ToolType from '#models/tool_type';
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    let tool_type = new ToolType()
    tool_type.name = 'Manual'
    await tool_type.save();

    tool_type = new ToolType()
    tool_type.name = 'Neumática'
    await tool_type.save();

    tool_type = new ToolType()
    tool_type.name = 'Hidráulica'
    await tool_type.save();
  }
}