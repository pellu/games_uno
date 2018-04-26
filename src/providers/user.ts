import { Injectable } from '@angular/core';

@Injectable()
export class User {
    id?:string;//"id_in_firebase";
    alias?:string;
    email?:string;
    score?:number;
    ttt_invitationsRecieved?:any;
    ttt_invitationSent?:any;
    
    constructor() {}

    
    
    
    init(
        id:string, 
        alias:string, 
        email:string,
        ttt_invitationSent:any, 
        ttt_invitationsRecieved: any
    ) {
        this.id = id
        this.alias = alias
        this.email = email
        this.ttt_invitationSent = ttt_invitationSent
        this.ttt_invitationsRecieved = ttt_invitationsRecieved
    }
}