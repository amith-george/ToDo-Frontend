import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TodoService, TodoTask } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tasks: TodoTask[] = [];
  activeTasks: TodoTask[] = [];
  completedTasks: TodoTask[] = [];
  taskForm: FormGroup;
  currentTab: 'active' | 'completed' = 'active';
  isModalOpen: boolean = false;

  constructor(
    private todoService: TodoService, 
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.todoService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.activeTasks = this.tasks.filter(t => !t.isCompleted);
        this.completedTasks = this.tasks.filter(t => t.isCompleted);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  setTab(tab: 'active' | 'completed') {
    this.currentTab = tab;
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.taskForm.reset();
  }

  addTask() {
    if (this.taskForm.valid) {
      const { title, description } = this.taskForm.value;
      this.todoService.createTask(title, description).subscribe({
        next: (newTask) => {
          this.tasks.unshift(newTask);
          this.activeTasks.unshift(newTask);
          this.closeModal();
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Failed to add task', err)
      });
    }
  }

  toggleCompletion(task: TodoTask) {
    const updatedStatus = !task.isCompleted;
    this.todoService.updateTask(task.id, { 
      title: task.title, 
      description: task.description, 
      isCompleted: updatedStatus 
    }).subscribe({
      next: () => {
        task.isCompleted = updatedStatus;
        this.activeTasks = this.tasks.filter(t => !t.isCompleted);
        this.completedTasks = this.tasks.filter(t => t.isCompleted);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to update task', err)
    });
  }

  deleteTask(id: number) {
    this.todoService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.activeTasks = this.activeTasks.filter(t => t.id !== id);
        this.completedTasks = this.completedTasks.filter(t => t.id !== id);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to delete task', err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
