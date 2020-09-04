import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { Time } from '@angular/common';

export class planDetails{
    public Organisation_Mst_Id:number;
    public Plan_Type_Mst_Id:number;
    public Plan_Name:string;
    public Is_Active:number;
    public Default_Light_Profile_Users:number ;
    public Default_Medium_Profile_Users:number;
    public Default_Heavy_Profile_Users:number;
    public Default_Expiry_In_Days:number;
    public Entry_By:number;
    public Expires_At:Date;
    public Status:Number;
    public No_of_Users:number;
    public No_of_Users_Count?:number;
    public No_Medium_Profile_Users:number;
    public No_Heavy_Profile_Users:number;
    public Days:string;
    public Start_Time:any;
    public End_Time:any;
    
    constructor(){
    this.Organisation_Mst_Id=0;
    this.Plan_Type_Mst_Id=0;
    this.Plan_Name="";
    this.Is_Active=0;
    this.Default_Light_Profile_Users=0 ;
    this.Default_Medium_Profile_Users=0;
    this.Default_Heavy_Profile_Users=0;
    this.Default_Expiry_In_Days=0;
    this.Entry_By=0;
    //this.Expires_At:Date;
    this.Status=0;
    this.No_of_Users=0;
    this.No_Medium_Profile_Users=0;
    this.No_Heavy_Profile_Users=0;
    this.Days="";

    }
}