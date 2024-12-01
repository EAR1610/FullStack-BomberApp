import db from '@adonisjs/lucid/services/db';

export default class ViewsController {
    public async getEmergenciesAttended() {
        const data = await db.rawQuery('SELECT * FROM v_emergencies_attended');
        return data[0];
    }

    public async getMostRequestedEmergencies() {
        const data = await db.rawQuery('SELECT * FROM v_most_requested_emergencies');
        return data[0];
    }

    public async getUserStatusCount() {
        const data = await db.rawQuery('SELECT * FROM v_user_status_count');
        return data[0];
    }

    public async getInactiveUsers(){
        const data = await db.rawQuery('SELECT * FROM v_inactive_users');
        return data[0];
    }

    public async getActiveFirefighters(){
        const data = await db.rawQuery('SELECT * FROM v_active_firefighters');
        return data[0];
    }
    
    public async getDurationRangeEmergencies(){
        const data = await db.rawQuery('SELECT * FROM v_emergencies_duration_range');
        return data[0];
    }

    public async getAllUsersCount(){
        const data = await db.rawQuery('SELECT * FROM v_count_users_by_role');
        return data[0];
    }
}