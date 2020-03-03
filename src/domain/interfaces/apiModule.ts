import { UserProfile } from '../models';

/*
This is the interface the domain will implement and that any user interface, REST or UI, depends upon.
*/

export interface IApiModule {

    login:                      (loginInfo: any) => Promise<any>;
    logout:                     (userId: string) => Promise<any>;
    createUserProfile:          (userProfile: UserProfile) => Promise<any>;
    retrieveAllUserProfiles:    () => Promise<UserProfile[]>;
    retrieveUserProfile:        (userId: string) => Promise<UserProfile>;
    updateUserProfile:          (userId: string, userProfile: UserProfile) => Promise<UserProfile>;
    disableUserProfile:         (userId: string) => Promise<any>;

}

