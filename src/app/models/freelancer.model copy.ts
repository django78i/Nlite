export class Freelancer {
    constructor(
        public uid: string, 
        public nom: string,
        public mail: string,
        public photo : string,
        public description : string, 
        public portfolio : []
    ){}
}