import {Component} from '@angular/core';
import {App, IonicPage, MenuController} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {GlobalProvider} from '../../../../providers/core/global-provider';
import {VariablesProvider} from '../../../../providers/core/variables-provider';
import {ModulesProvider} from '../../../../providers/core/modules-provider';

@IonicPage()
@Component({selector: 'page-core-cc-company', templateUrl: 'company.html'})
export class CoreCcCompanyPage {
    private company: any = [];

    constructor(private app: App, private storage: Storage, private globalProvider: GlobalProvider, 
           modulesProvider: ModulesProvider, 
           private menuCtrl: MenuController) {
        //this.menuCtrl = menuCtrl;
        this.menuCtrl.enable(false, 'mainMenu');        
        this.company = GlobalProvider.getJupiterSystemData.company;
        modulesProvider.ClearData();
    }

    openPage(item) {
        this
        .storage
        .ready()
        .then(() => {
            this
                .storage
                .set(GlobalProvider.getCoreStorageKeys.company, JSON.stringify(item));
        }).then(() => {
            VariablesProvider.company = item;
            GlobalProvider.pushPage('CoreCcTabsPage');
            this.app.getRootNav().setRoot('CoreCcTabsPage', {}, {animate: true, direction: 'forward'})
        });
    }

    getCompanyIcon(item): string {
        if (item.icon != null)
            return "url('data:image/png;base64," + item.icon;
        else
            return " url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTcyRDEyQzA2QUJDMTFFN0I4MDREMjBENTFCNUNFRDEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTcyRDEyQzE2QUJDMTFFN0I4MDREMjBENTFCNUNFRDEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NzJEMTJCRTZBQkMxMUU3QjgwNEQyMEQ1MUI1Q0VEMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1NzJEMTJCRjZBQkMxMUU3QjgwNEQyMEQ1MUI1Q0VEMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pus3V1wAAAHUUExURbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tba2trW1tbW1tbW1tbW1tba2trW1tbW1tbW1tbW1tba2trW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbCwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8nJycrKysvLy8zMzM3Nzc/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d/f3+Hh4ePj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f///914cEAAAABSdFJOUwABBAUJCgwSFBscHR4qLS4vMTM0Nzg6P0FDRUdPUFJZWl1eZ2hqdHeAgYOEjY6SlJWZmpydoaSnp6ixur/AyszOz9La3N3j5Ofo7O7v9fb5+v20QCmtAAACbklEQVQYGXXB519TZxgG4Ee0Dtpq3aUWR90DZ6e1rtrWjZ68z3O/52RAWK5WKCFBUhSNETUiggOV+5/tOYkf/Klcl7yzav/Bjc0yt6/OADjZ1rpI5nAeDe1Hdqxpko+tRsJDzcyfPbx1qXxgF2LeMDhe/QeA2alDm5bIe44iYVWSj03R2Qn1ONa2rkkaPrvsodBBkkXV/knySZ95AKfXSl2rt8y1DF6Sd5zeZV3OkGiRxF7rmmEmIt9EboSxyUkOKBI/SeJ3e8Zpy5L3XI5kIWcapVH3o8Q+tw5yykJyJFUkuwIX5tJQeABbJPaddZLMugpHXYV9Qe/YDDldgnn89YXEfoF/RRaDbk64qadBgQ21EDggiXPQAZL5oMhsofcGH4+OjM2QvKXYILEvPUwr5Nve1N8lpItZdc5Fw+Q0sFhi2+1aRbVMstqTA/DvxP1S3rkBTtkJSfxqDznkXL5UnSwCyPZUSf5nrnLT9khs/kWrkeXIpZxGxQwGb6a6Z8hxM/ivJdYCLZB8PXZr5AEHO4YzLAe5WXJIcalJYrsBPGRDObhPfcArwQDJCL9JbOFxeMPQNDlbuZrqZM0V+UjDN2SPbZPYegAeikxHWoPsK46mCmRGa2S3LZfY96iLQrV0/yzZ5W6T3Vrj6/CcJH5AQq/z6QRjYw4vyFxI9unPkljRjkSGdeOWGiaJ6HrO/GapW/knAG89NfL5kLl+kmWFmkezNMxb13YM3pDPR6r3SE6ESPwh71my6dApMwA3qo9KoXnEDsoHlm09fNabQeGR+FY+1rRm55F2vLNAPm1Ra9tJABdaZG7NG/bt/0Ya/gfmtCWJ0EYtTAAAAABJRU5ErkJggg==')";
            //return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkI0M0ZENTg3MUY0MTFFNTlCRTVCMzk3MTMwM0MwNEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkI0M0ZENTk3MUY0MTFFNTlCRTVCMzk3MTMwM0MwNEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyQjQzRkQ1NjcxRjQxMUU1OUJFNUIzOTcxMzAzQzA0RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyQjQzRkQ1NzcxRjQxMUU1OUJFNUIzOTcxMzAzQzA0RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgfiJ4oAAAfMSURBVHjatFcLUFTX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')";
            //return "url('spin.png')";
            //return "url('../assets/images/spin.png')";
    }
}