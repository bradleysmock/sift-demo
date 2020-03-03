import { Router } from "express";
import { IDomainModule } from "../domain";

export class RestController {
    router: Router;
    baseUrl = process.env.baseUrl || 'http://localhost:3000';

    checkCredentials = async (request: any, response: any, next: any) => {
        // I ran out of time here, but my plan was to verify the existence of a proper bearer token,
        // verify it's associated user, and match that user to the requested user profile to ensure
        // that the requestee can only modify/disable their own profile. This should also return a 401
        // if a user is unauthorized instead of a blanket passthrough.

        // TODO
        // need to authenticate code
        // need to authorize action by ensuring code belongs to same user as profile
        next();
    }

    // Pass in the dependencies of an Express router and the domain logic module. This modularity allows 
    // easy modification, testing, and separation of concerns. This file just matches routes to domain logic
    // and handles REST-level error processing.
    constructor(router: Router, domain: IDomainModule) {
        this.router = router;

        router.get('/login', async (request, response) => {
            // I took a risk here and decided to use AWS Cognito for user management and login instead of 
            // rolling my own with bcrypt password hashing. It's beautifully simple and quick to do a rough
            // and ready setup, including SAML and third-party authentication, but a disadvantage here is 
            // that I'd need to link that user pool with the user profile stored in the SQL backend 
            // (or push the entire profile to Cognito).
            response.redirect(`https://sift-demo-app.auth.us-east-1.amazoncognito.com/login?client_id=7nj5ght5vnbp8ipvgp9olopd6g&response_type=code&scope=email+openid+profile&redirect_uri=${this.baseUrl}/session`);
        });

        router.get('/logout', async (request, response) => {
            response.redirect(`https://sift-demo-app.auth.us-east-1.amazoncognito.com/logout?client_id=7nj5ght5vnbp8ipvgp9olopd6g&response_type=code&redirect_uri=${this.baseUrl}/session`);
        });

        router.all('/session', async (request, response) => {
            // This is functioning as the callback for the login/logout methods.

            // The response for a code grant flow would look something like {"code":"fb46f0b3-5c45-4d08-a76e-cbdc8e5ab5bb"}.
            // That would then be used to exchange for a token, something like this:
            // id_token=eyJraWQiOiJOK0NtQlMzNDFWaHpScDBjalkyRGxDdkxWSWpYMGpMNlo0TGNGZlV6SEZjPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoicmlxR0ZoZlY0RGFLcWVXUU9Tbld4ZyIsInN1YiI6ImM2M2RjNjUwLTBhOTAtNDc5OS04Yzk5LTc1MjY4YTVmNTg5ZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9BRGtIN1FpZjYiLCJjb2duaXRvOnVzZXJuYW1lIjoiYnJhZGxleSIsImdpdmVuX25hbWUiOiJCcmFkbGV5IiwiYXVkIjoiN25qNWdodDV2bmJwOGlwdmdwOW9sb3BkNmciLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU4MzEyNDg0MSwiZXhwIjoxNTgzMTI4NDQxLCJpYXQiOjE1ODMxMjQ4NDEsImZhbWlseV9uYW1lIjoiU21vY2siLCJlbWFpbCI6ImJyYWRsZXlzbW9ja0BnbWFpbC5jb20ifQ.O1LgZVvKjxUGeP0L_16lH-PHJeu-hdhq_bK_qp9Sce8V9m9FzTKFhC8AlCxo5VDBGNDuHYCYlGdHpLoTVrrG9SUKq0Qd_GeMSzmbGVdDTm1vBLn3ZqZdkMyuXVPCqQsAv4Elscuv1z_bVSPV-Ab4WZGZnVSIa7xJOi_GZ1uFPWwdhnGAsq_hHpfpxBrzgO2D2fhyxEm6QnHVzgHb13S5BkX9_RGPzX5r8tyCItn6RU5rZLjDXgFfVAxRFtzzKgI3gprbL3buwRYXzwot6YGe5E3ryjRMrMdFIEZCPptpAfTOvjNRzks37BFT1vdPI9JdlYHt5EE0kL1Jwq7Yqz6e1Q
            // access_token=eyJraWQiOiJ0Zit3SjFxaExkajc4QUNKK1JoMm5BOXJmY1licFF3U3FEdEd4MGM2WlVBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjNjNkYzY1MC0wYTkwLTQ3OTktOGM5OS03NTI2OGE1ZjU4OWQiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNTgzMTI0ODQxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9BRGtIN1FpZjYiLCJleHAiOjE1ODMxMjg0NDEsImlhdCI6MTU4MzEyNDg0MSwidmVyc2lvbiI6MiwianRpIjoiYjBlZjI2NjQtZDUyMC00MjZiLThkMzQtMmJjNDZmZWQ5ZjE4IiwiY2xpZW50X2lkIjoiN25qNWdodDV2bmJwOGlwdmdwOW9sb3BkNmciLCJ1c2VybmFtZSI6ImJyYWRsZXkifQ.XkOSJdEfZjGQnByRNG-QEsOw7hGyN3_VwRo61jFqKbRrkqLd3nZLnyMgXlUJrwpWpptmeaF452sfr1vWROi3xtBkYJ2lO--Jq-sGz3Rg3mv_DEJrbSgHM7V4lhPhAwVoxwICyCIY8IsuSY_mF0I5yZbGxD6FHI30ceVvTzoYHyWOy9fCkWQNBFLuZ0pt5f9RZO4fweYYzjySD1Z_GLr1TxVMl9SZlN7mo7j63gNkQxjloAgK60CBZn4zodg1Z9jUwV7SOt43ZKX3fB-an1fKuGDiPqNvC4cpDQt6P9mdPGJqPI2Ka8Q8R5g6oLnVbb5pMuJZiKl-at6Rl6sHcAWiUg
            // expires_in=3600
            // token_type=Bearer

            // The response for an implicit flow would be consumed by the front end and would look something like (broken apart):
            // http://localhost:3000/session
            // #id_token=eyJraWQiOiJOK0NtQlMzNDFWaHpScDBjalkyRGxDdkxWSWpYMGpMNlo0TGNGZlV6SEZjPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoicmlxR0ZoZlY0RGFLcWVXUU9Tbld4ZyIsInN1YiI6ImM2M2RjNjUwLTBhOTAtNDc5OS04Yzk5LTc1MjY4YTVmNTg5ZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9BRGtIN1FpZjYiLCJjb2duaXRvOnVzZXJuYW1lIjoiYnJhZGxleSIsImdpdmVuX25hbWUiOiJCcmFkbGV5IiwiYXVkIjoiN25qNWdodDV2bmJwOGlwdmdwOW9sb3BkNmciLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU4MzEyNDg0MSwiZXhwIjoxNTgzMTI4NDQxLCJpYXQiOjE1ODMxMjQ4NDEsImZhbWlseV9uYW1lIjoiU21vY2siLCJlbWFpbCI6ImJyYWRsZXlzbW9ja0BnbWFpbC5jb20ifQ.O1LgZVvKjxUGeP0L_16lH-PHJeu-hdhq_bK_qp9Sce8V9m9FzTKFhC8AlCxo5VDBGNDuHYCYlGdHpLoTVrrG9SUKq0Qd_GeMSzmbGVdDTm1vBLn3ZqZdkMyuXVPCqQsAv4Elscuv1z_bVSPV-Ab4WZGZnVSIa7xJOi_GZ1uFPWwdhnGAsq_hHpfpxBrzgO2D2fhyxEm6QnHVzgHb13S5BkX9_RGPzX5r8tyCItn6RU5rZLjDXgFfVAxRFtzzKgI3gprbL3buwRYXzwot6YGe5E3ryjRMrMdFIEZCPptpAfTOvjNRzks37BFT1vdPI9JdlYHt5EE0kL1Jwq7Yqz6e1Q
            // &access_token=eyJraWQiOiJ0Zit3SjFxaExkajc4QUNKK1JoMm5BOXJmY1licFF3U3FEdEd4MGM2WlVBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjNjNkYzY1MC0wYTkwLTQ3OTktOGM5OS03NTI2OGE1ZjU4OWQiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNTgzMTI0ODQxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9BRGtIN1FpZjYiLCJleHAiOjE1ODMxMjg0NDEsImlhdCI6MTU4MzEyNDg0MSwidmVyc2lvbiI6MiwianRpIjoiYjBlZjI2NjQtZDUyMC00MjZiLThkMzQtMmJjNDZmZWQ5ZjE4IiwiY2xpZW50X2lkIjoiN25qNWdodDV2bmJwOGlwdmdwOW9sb3BkNmciLCJ1c2VybmFtZSI6ImJyYWRsZXkifQ.XkOSJdEfZjGQnByRNG-QEsOw7hGyN3_VwRo61jFqKbRrkqLd3nZLnyMgXlUJrwpWpptmeaF452sfr1vWROi3xtBkYJ2lO--Jq-sGz3Rg3mv_DEJrbSgHM7V4lhPhAwVoxwICyCIY8IsuSY_mF0I5yZbGxD6FHI30ceVvTzoYHyWOy9fCkWQNBFLuZ0pt5f9RZO4fweYYzjySD1Z_GLr1TxVMl9SZlN7mo7j63gNkQxjloAgK60CBZn4zodg1Z9jUwV7SOt43ZKX3fB-an1fKuGDiPqNvC4cpDQt6P9mdPGJqPI2Ka8Q8R5g6oLnVbb5pMuJZiKl-at6Rl6sHcAWiUg
            // &expires_in=3600
            // &token_type=Bearer
           
            // TODO handle the response -- I ran out of time to actually implement this portion.

            // For now just log/return the response
            console.log('session response', request.query);
            response.json(request.query);
        });

        router.post('/user', this.checkCredentials, async (request, response) => {
            // A production-ready implementation would need to handle errors and send
            // various HTTP codes, a 200 or 201 on success and a 400 for bad/missing data
            // in the request for example.
            response.json(domain.createUserProfile(request.body));
        });

        router.get('/user', async (request, response) => {
            response.json(domain.retrieveAllUserProfiles());
        });

        router.get('/user/:id', async (request, response) => {
            // This should return a 404 if a user with the specified id doesn't exist
            // and appropriate error codes if necessary.
            const userId = request.params.user_id;
            response.json(domain.retrieveUserProfile(userId));
        });

        router.put('/user', async (request, response) => {
            // The PUT here by standards requires the full user profile. It could use a 
            // PATCH instead to do partial updates. And the return should have appropriate
            // success/error codes.
            const userId = request.params.user_id;
            response.json(domain.updateUserProfile(userId, request.body));
        });

        router.delete('/user', async (request, response) => {
            // Like the others, adding appropriate error codes is necessary before production.
            const userId = request.params.user_id;
            response.json(domain.disableUserProfile(userId));
        });

    }

}