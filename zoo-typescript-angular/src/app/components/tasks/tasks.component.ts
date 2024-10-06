import {Component, Input, OnInit} from '@angular/core';
import {TaskService} from '../../services/task.service';
import {Task} from '../../models/task.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TasksComponent implements OnInit {
  @Input() projectId!: number;  // Input to receive the project ID
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    if (this.projectId) {
      this.taskService.getTasks(this.projectId).subscribe({
        next: (data) => {
          this.tasks = data;
          console.log('Tasks loaded:', this.tasks);
        },
        error: (err) => {
          console.error('Error fetching tasks:', err);
        }
      });
    }
  }
}
