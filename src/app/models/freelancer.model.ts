export class Freelancer {
    constructor(
        public uid: string, 
        public nom: string,
        public mail: string,
        public photo : string,
        public status: string,
        public description : string, 
        public prixMinimum : number,
        public categories: [],
        public portfolio : [],
        public adresse : any
    ){}
}