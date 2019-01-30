import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppRepository } from '@smc/modules/ser/provider';
import { SER_INITIAL_SCRIPT } from '@smc/modules/ser/model/default-script';

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
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.formNameControl = this.formBuilder.control('', Validators.required);
  }

  public async apply() {

    if (this.formNameControl.valid) {
      const id = await this.appRepository.createApp(this.formNameControl.value);
      this.router.navigate([`apps/new/${id}`]);
    }
  }

  public cancel() {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }

  public navigateBack() {
    this.cancel();
  }
}
