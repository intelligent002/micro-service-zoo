import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Project} from '../../../models/project.model';
import {ProjectService} from '../../../services/project.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProjectEditComponent implements AfterViewInit, OnChanges {
  updateForm!: FormGroup;

  @Input() project!: Project;  // Receive the project from the parent
  @ViewChild('projectNameInput') projectNameInput!: ElementRef;
  @Output() projectUpdated = new EventEmitter<Project>();

  constructor(private fb: FormBuilder, private projectService: ProjectService) {
  }

  // Initialize the form with the project data when the project input changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && changes['project'].currentValue) {  // Corrected access with square brackets
      const project = changes['project'].currentValue;  // Get the updated project
      this.updateForm = this.fb.group({
        name: [project.name, Validators.required]  // Initialize with project name
      });
    }
  }

  ngAfterViewInit(): void {
    // Automatically focus on the project name input field when the component is loaded
    if (this.projectNameInput) {
      this.projectNameInput.nativeElement.focus();
    }
  }

  async updateProject(): Promise<void> {
    if (this.updateForm.valid) {
      // Emit the updated project
      const updatedProject = {...this.project, ...this.updateForm.value};
      this.projectUpdated.emit(updatedProject);

      // Optionally, call a service to update the project on the server
      this.projectService.updateProject(updatedProject).subscribe({
        next: () => {
          console.log('Project updated successfully');
        }, error: (error) => {
          console.error('Error updating project:', error);
        }
      });
    }
  }
}
