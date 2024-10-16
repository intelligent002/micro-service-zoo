import {Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
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

  constructor(private fb: FormBuilder, private projectService: ProjectService, private renderer: Renderer2) {
    this.createForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  // Focus the input field after the view is rendered
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.projectNameInput) {
        this.renderer.selectRootElement(this.projectNameInput.nativeElement).focus();
      }
    });
  }

  ngOnInit(): void {
  }

  async createProject(): Promise<void> {
    if (this.createForm.valid) {
      // let's speed up a bit the hide of the form
      this.projectCreated.emit();
      // and now handle the creation
      const projectData = this.createForm.value;
      this.projectService.createProject(projectData).subscribe();
    }
  }
}
