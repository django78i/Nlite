export class User {
    constructor(
        public uid : string,
        public displayName: string,
        public email: string,
        public password: string,
        public status: string,
        public categories: []
    ){}
}