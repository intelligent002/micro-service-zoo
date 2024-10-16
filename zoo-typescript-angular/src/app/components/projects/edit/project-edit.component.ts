import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
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
export class ProjectEditComponent implements OnChanges {
  updateForm!: FormGroup;

  @Input() project!: Project;  // Receive the project from the parent
  @ViewChild('projectNameInput') projectNameInput!: ElementRef;
  @Output() projectUpdated = new EventEmitter<Project>();

  constructor(private fb: FormBuilder, private projectService: ProjectService, private renderer: Renderer2) {
  }

  // Initialize the form with the project data when the project input changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && changes['project'].currentValue) {
      const project = changes['project'].currentValue;
      this.updateForm = this.fb.group({
        name: [project.name, Validators.required]
      });
    }
  }

  // Focus the input field after the view is rendered
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.projectNameInput) {
        this.renderer.selectRootElement(this.projectNameInput.nativeElement).focus();
      }
    });
  }

  async updateProject(): Promise<void> {
    if (this.updateForm.valid) {
      // quickly switch to view mode
      const updatedProject = {...this.project, ...this.updateForm.value};
      this.projectUpdated.emit(updatedProject);
      // update project in the background and trigger its view update via the observable object
      this.projectService.updateProject(updatedProject).subscribe();
    }
  }
}
