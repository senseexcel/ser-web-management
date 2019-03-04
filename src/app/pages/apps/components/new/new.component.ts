import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppRepository } from '@smc/modules/ser/provider';
import { SER_INITIAL_SCRIPT } from '@smc/modules/ser/model/default-script';
import { SmcCache, EnigmaService } from '@smc/modules/smc-common';
import { IApp } from '@smc/modules/qrs';

@Component({
  selector: 'smc-qlik-new',
  templateUrl: './new.component.html'
})
export class AppNewComponent implements OnInit {

  public formNameControl: FormControl;

  constructor(
    @Inject(SER_INITIAL_SCRIPT) private initialScript,
    private formBuilder: FormBuilder,
    private appRepository: AppRepository,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private smcCache: SmcCache,
    private enigmaService: EnigmaService
  ) {
  }

  ngOnInit() {
    this.formNameControl = this.formBuilder.control('', Validators.required);
  }

  public async apply() {

    if (this.formNameControl.valid) {
      const app = await this.appRepository.createApp(this.formNameControl.value);

      await this.enigmaService.reloadApps();

      // we could write app to list now since it is created now
      if (this.smcCache.has('ser.apps')) {
        const apps = this.smcCache.get<IApp[]>('ser.apps');
        apps.push(app);
      }

      this.router.navigate([`apps/new/${app.id}`]);
    }
  }

  public cancel() {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }

  public navigateBack() {
    this.cancel();
  }
}
