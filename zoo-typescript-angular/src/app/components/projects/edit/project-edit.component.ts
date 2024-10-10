import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProjectEditComponent {
  @Input() project!: Project;
  @Output() save = new EventEmitter<Project>();
  @Output() cancel = new EventEmitter<void>();

  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnChanges(): void {
    if (this.project) {
      this.editForm.patchValue({ name: this.project.name });
    }
  }

  onSave(): void {
    if (this.editForm.valid) {
      const updatedProject: Project = {
        ...this.project,
        name: this.editForm.value.name
      };
      this.save.emit(updatedProject);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
