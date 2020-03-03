import { UserProfile } from '../models';

/*
This is the interface the persistence layer implements and that the domain expects for all persistence needs.
*/

export interface IDataModule {

    createUserProfile:          (userProfile: UserProfile) => Promise<any>;
    retrieveAllUserProfiles:    () => Promise<UserProfile[]>;
    retrieveUserProfile:        (userId: string) => Promise<UserProfile>;
    updateUserProfile:          (userId: string, userProfile: UserProfile) => Promise<UserProfile>;
    disableUserProfile:         (userId: string) => Promise<any>;

}