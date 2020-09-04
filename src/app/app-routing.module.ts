import { OverviewComponent } from "./pages/overview/overview.component";
import { ChangePasswordComponent } from "./pages/change-password/change-password.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { HomeComponent } from "./pages/home/home.component";
import { ConfirmPopUpComponent } from "./pages/confirm-pop-up/confirm-pop-up.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { EmployeesComponent } from "./pages/employees/employees.component";
import { OrganizationComponent } from "./pages/organization/organization.component";
import { DepartmentComponent } from "./pages/department/department.component";
import { BillingComponent } from "./pages/billing/billing.component";
import { AccountActivationComponent } from "./pages/account-activation/account-activation.component";

import { OnPremisesUsersComponent } from "./pages/on-premises-users/on-premises-users.component";
import { OfficeBcpHeaderComponent } from "./shared/office-bcp-header/office-bcp-header.component";
import { HowUseServicesComponent } from "./pages/how-use-services/how-use-services.component";
import { CostExplorerComponent } from "./pages/cost-explorer/cost-explorer.component";
import { UsageInsightsComponent } from "./pages/usage-insights/usage-insights.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  {
    path: "",
    component: OfficeBcpHeaderComponent,
    children: [
      { path: "employees", component: EmployeesComponent },
      { path: "overview", component: OverviewComponent },
      { path: "organization", component: OrganizationComponent },
      { path: "department", component: DepartmentComponent },
      { path: "howUseServices", component: HowUseServicesComponent },
      { path: "billing", component: BillingComponent },
      { path: "on-premises-users", component: OnPremisesUsersComponent },
      { path: "cost-explorer", component: CostExplorerComponent },
      { path: "usage-insights", component: UsageInsightsComponent },
      // { path: 'on-premises-users', component: OnPremisesUsersComponent },
    ],
  },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "confirmpopup", component: ConfirmPopUpComponent },
  { path: "change-password", component: ChangePasswordComponent },
  { path: "reset-password/:token", component: ResetPasswordComponent },
  // { path: 'signup', component: SignupComponent },
  {
    path: "account-activation/:token",
    loadChildren: () =>
      import("./pages/account-activation/account-activation.module").then(
        (m) => m.AccountActivationModule
      ),
  },
  { path: "**", redirectTo: "home", pathMatch: "full" },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
