import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GroupService} from "../../../../../services/group.service";
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-remove-project-dialog',
  templateUrl: './remove-project-dialog.component.html',
  styleUrls: ['./remove-project-dialog.component.scss']
})
export class RemoveProjectDialogComponent implements OnInit {

  titleSecurityForm: FormGroup;
  errorMessage: string;

  constructor(
    public dialogRef: MatDialogRef<RemoveProjectDialogComponent>,
    private formBuilder: FormBuilder,
    private groupService: GroupService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.titleSecurityForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  onCancel() {
    this.closeDialog();
  }

  onSubmit() {
    const formValue = this.titleSecurityForm.value;
    const title = formValue.title;

    if (title === this.data.group.title) {
      this.groupService.removeGroup(this.data.group._id)
        .subscribe(response => {
          this.closeDialog();
          this.router.navigate(['/in/groups']);
        });
    } else {
      this.errorMessage = 'Wrong title';
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
