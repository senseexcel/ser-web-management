import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SerAppManagerService } from '@core/modules/ser-app/provider/ser-app-manager.service';
import { ISerApp } from '@core/modules/ser-app/api/ser-app.interface';


@Component({
  selector: 'app-qlik-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class AppNewComponent  implements OnInit {

  private formBuilder: FormBuilder;
  public formNameControl: FormControl;

  private route: ActivatedRoute;
  private router: Router;

  constructor(
    private appManager: SerAppManagerService,
    formBuilder: FormBuilder,
    router: Router
  ) {
    this.formBuilder = formBuilder;
    this.router = router;
  }

  ngOnInit() {
    this.formNameControl = this.formBuilder.control('', Validators.required);
  }

  public apply() {
    if (this.formNameControl.valid) {
      const name = this.formNameControl.value;
      this.appManager.createApp(name)
        .then((app: ISerApp) => {
          this.router.navigate([`apps/new/${app.appId}`]);
        });
    }
  }

  public cancel() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

}
