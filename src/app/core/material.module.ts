import { NgModule } from '@angular/core';
import { MatBadgeModule, MatBottomSheetModule, MatTabsModule, MatExpansionModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';

@NgModule({
    exports: [MatBadgeModule, MatBottomSheetModule, MatListModule, MatTabsModule, MatExpansionModule]
})
export class MaterialModule {}
