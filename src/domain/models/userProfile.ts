export class UserProfile {

    givenName:          string;
    familyName:         string;
    email:              string;
    company:            string;
    jobTitle:           string;
    yearsExperience:    number;
    skills:             string[];
    

    constructor(data: any) {
        this.givenName = data.givenName;
        this.familyName = data.familyName;
        this.email = data.email;
        this.company = data.company;
        this.jobTitle = data.jobTitle;
        this.yearsExperience = data.yearsExperience;
        this.skills = data.skills;
    }

    // This example is brief, but we could add user profile logic, like a fullName function or
    // model validation, here.

}