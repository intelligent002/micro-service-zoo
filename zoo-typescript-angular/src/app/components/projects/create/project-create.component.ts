import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ProjectService} from '../../../services/project.service';
import {CommonModule} from '@angular/common';
import {Project} from '../../../models/project.model';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./project-create.component.scss']
})

export class ProjectCreateComponent implements OnInit {
  createForm: FormGroup;

  @Output() projectCreated = new EventEmitter<Project>();
  @ViewChild('projectNameInput') projectNameInput!: ElementRef;

  constructor(private fb: FormBuilder, private projectService: ProjectService, private router: Router) {
    this.createForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    // Automatically focus on the project name input field when the component is loaded
    this.projectNameInput.nativeElement.focus();
  }

  ngOnInit(): void {
  }

  async createProject(): Promise<void> {
    if (this.createForm.valid) {
      // let's speed up a bit the hide of the form
      this.projectCreated.emit();
      // and now handle the creation
      const projectData = this.createForm.value;
      this.projectService.createProject(projectData).subscribe({
        next: () => {
          console.log('Project created successfully');
        }, error: (error) => {
          console.error('Error creating project:', error);
        }
      });
    }
  }
}
