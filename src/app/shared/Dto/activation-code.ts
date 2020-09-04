export class ActivationCodeDto{
    ActivationLink :string;
    Dt_LinkExpirationTime : Date;
    LinkExpirationTime : string;
    ActivationCode : string;
    Dt_CodeExpirationTime : string;
    CodeExpirationTime : string;
    LinkGUID : string;
    EntryBy : string;
    CodeExpireMinutes : string;
    MessageId : string;
    LastName : string;
    MiddleName : string;
    SendMailToUser : boolean;
    MethodType : number;
    Response : string;
    DynamoToken: string;
    EmailID : string;
}