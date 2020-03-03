/******************** Domain *****************/

import { IApiModule, IDataModule } from './interfaces';
import { UserProfile } from './models';

export type IDomainModule = IApiModule ;
export type IPersistenceModule = IDataModule;

export class DomainModule implements IApiModule {
    DataModule: IDataModule;

    constructor(dataModule: IDataModule) {
        this.DataModule = dataModule;
    }

    /* 
    Obviously, it isn't sustainable to keep all logic in a single file. Logic should be refactored 
    and split across separate services, as well as into models where appropriate. I created two 
    empty service files to demonstrate that direction.
    */


    async login(loginInfo: any): Promise<any> {
        /* 
        My choice to use AWS Cognito made this largely unnecessary, but I imagine logic to 
        retrieve a hashed password, compare it to the user input using bcrypt, and return success
        based on that match, as well as session token generation and caching here if I had decided
        to use a native solution.
        */
    }

    async logout(userId: string): Promise<any> {
        /*
        Similar comments to login, but with logic to destroy any cached session tokens.
        */
    }

    async createUserProfile(userProfile: UserProfile): Promise<UserProfile> {
        // I'm being quite naive in not validating the user profile here or
        // within the model and proceeding accordingly.
        return this.DataModule.createUserProfile(userProfile);
    }

    async retrieveAllUserProfiles(): Promise<UserProfile[]> {
        return this.DataModule.retrieveAllUserProfiles();
    }

    async retrieveUserProfile(userId: string): Promise<UserProfile> {
        // Naive here as well if the userId is null or undefined.
        return this.DataModule.retrieveUserProfile(userId);
    }

    async updateUserProfile(userId: string, userProfile: UserProfile): Promise<UserProfile> {
        // Same naivety regarding valid user input here...
        return this.DataModule.updateUserProfile(userId, userProfile);
    }

    disableUserProfile(userId: string): Promise<any> {
        // A more production ready implementation would handle no user
        // with an id matching userId as well as a null/undefined userId.
        return this.DataModule.disableUserProfile(userId);
    }
}
