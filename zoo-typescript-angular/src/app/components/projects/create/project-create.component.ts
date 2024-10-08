import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ProjectService} from '../../../services/project.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent implements OnInit {
  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router
  ) {
    this.createForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  createProject(): void {
    if (this.createForm.valid) {
      const projectData = this.createForm.value;
      this.projectService.createProject(projectData).subscribe({
        next: (response) => {
          console.log('Project created successfully:', response);
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          console.error('Error creating project:', error);
        }
      });
    }
  }
}
