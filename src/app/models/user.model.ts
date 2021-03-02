export class User {
    constructor(
        public uid : string,
        public displayName: string,
        public email: string,
        public password: string,
        public adresse: string,
        public status: string,
        public categories: [],
        public creneau : any,
        public delai : any,
        public jourRepos : any,
        public validationAuto : any,
        public modeRdv : any,
        public description : any,
        public prestation : []
    ){}
}