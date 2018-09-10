import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


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

  constructor(formBuilder: FormBuilder, router: Router) {
    this.formBuilder = formBuilder;
    this.router = router;
  }

  ngOnInit() {

    this.formNameControl = this.formBuilder.control('', Validators.required);
  }
  
public apply() {
  if (this.formNameControl.valid) {
    this.router.navigate([`apps/new/${this.formNameControl.value}`]);
  }
}
  public cancel() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

}
