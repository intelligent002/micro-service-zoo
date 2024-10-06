import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../services/project.service';
import {Project} from '../../models/project.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  standalone: true,
  styleUrls: ['./projects.component.scss'],
  imports: [CommonModule]
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.projectService.getProjectsList().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
  }
}
