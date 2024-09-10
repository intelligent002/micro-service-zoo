@extends('layouts.app')

@section('content')
    <h1>Task Manager</h1>

    <script>
        function redirectToProject() {
            const projectId = document.getElementById('project-filter').value;
            window.location.href = `/tasks/${projectId}`;
        }
    </script>

    <div class="form-container">
        <!-- Project Filter Dropdown -->
        <form id="project-filter-form" class="filter-form">
            <label for="project-filter">Filter by Project:</label>
            <select name="project_id" id="project-filter" onchange="redirectToProject()">
                @foreach($projects as $project)
                    <option value="{{ $project->id }}" {{ $selectedProjectId == $project->id ? 'selected' : '' }}>
                        {{ $project->name }}
                    </option>
                @endforeach
            </select>
        </form>

        <!-- Add Task Form -->
        <form action="{{ route('tasks.store') }}" method="POST" class="add-task-form">
            @csrf
            Add task:
            <input type="text" name="name" placeholder="Task name">
            <select name="project_id">
                @foreach($projects as $project)
                    <option value="{{ $project->id }}" {{ $selectedProjectId == $project->id ? 'selected' : '' }}>
                        {{ $project->name }}
                    </option>
                @endforeach
            </select>
            <button type="submit">Add Task</button>
        </form>
    </div>

    <!-- Task List -->
    <div id="task-list">
        @if($tasks->isEmpty())
            <p>No tasks found for this project.</p>
        @else
            <h3>{{ $project->name }}</h3>
            <ul class="sortable" data-project="{{ $project->id }}">
                @foreach($tasks as $task)
                    <li data-id="{{ $task->id }}" class="task-item">
                        <span class="task-info">{{ $task->name }} (Priority: {{ $task->priority }})</span>
                        <div class="task-actions">
                            <button type="button" class="button-edit"
                                    onclick="window.location.href='{{ route('tasks.edit', $task->id) }}'">
                                Edit
                            </button>
                            <form action="{{ route('tasks.destroy', $task->id) }}" method="POST"
                                  class="delete-form">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="button-delete">Delete</button>
                            </form>
                        </div>
                    </li>
                @endforeach
            </ul>
        @endif
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script>
        $(".sortable").sortable({
            update: function (event, ui) {
                let tasks = $(this).sortable('toArray', {attribute: 'data-id'});
                $.ajax({
                    url: '{{ route("tasks.reorder") }}',
                    type: 'POST',
                    data: {
                        _token: '{{ csrf_token() }}',
                        tasks: tasks
                    },
                    success: function (response) {
                        console.log(response);
                    }
                });
            }
        });
    </script>
@endsection
