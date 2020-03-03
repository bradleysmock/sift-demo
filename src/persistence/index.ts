import * as mysql from 'mysql';
import { IPersistenceModule } from '../domain';

export class SQLDatabasePersistence implements IPersistenceModule {
    database: mysql.Connection;

    constructor() {
        this.database = mysql.createConnection({
            // Update to use a real MySql database
            host     : 'demo.org',
            user     : 'bob',
            password : 'shhh'
        });
    }

    /* 
    Note: the authentication method I chose keeps user data separate from this SQL database
    If I had chosen to native method, I'd need methods for user creation including email and password,
    (hashed) user password retrieval for comparison to a log in request, and password change/retrieval
    eventually. 
    */

    async createUserProfile(data: any): Promise<any> {
        return new Promise( (resolve, reject) => {
            this.database.query(`
            INSERT INTO user_profiles
            (family_name, given_name, email, company, job_title, years_experience, skills)
            values (${data.familyName}, ${data.givenName}, ${data.email}, ${data.company}, 
                ${data.jobTitle}, ${data.yearsExperience}, ${data.skills})
        `,
            (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    
    async retrieveAllUserProfiles(): Promise<any[]> {
        return new Promise( (resolve, reject) => {
            this.database.query(`SELECT * FROM user_profiles WHERE is_active=1`,
            (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    
    async retrieveUserProfile(userId: string): Promise<any> {
        return new Promise( (resolve, reject) => {
            this.database.query(`SELECT * FROM user_profiles WHERE id = ${userId}`,
            (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    
    async updateUserProfile(userId: string, data: any): Promise<any> {
        return new Promise( (resolve, reject) => {
            this.database.query(`
                UPDATE user_profiles SET
                family_name=${data.familyName} , given_name=${data.givenName} , email=${data.email} , company=${data.company}, 
                job_title=${data.jobTitle}, years_experience=${data.yearsExperience}, skills=${data.skills}
                WHERE id = ${userId}
            `,
            (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    
    async disableUserProfile(userId: string): Promise<any> {
        return new Promise( (resolve, reject) => {
            this.database.query(`UPDATE user_profiles SET is_active=0 WHERE id = ${userId}`,
            (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
}
