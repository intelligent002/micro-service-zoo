@extends('layouts.app')

@section('content')
    <h1>Edit Task</h1>

    <form action="{{ route('tasks.update', $task->id) }}" method="POST">
        @csrf
        @method('PUT')
        <input type="text" name="name" value="{{ $task->name }}">
        <select name="project_id">
            @foreach($projects as $project)
                <option value="{{ $project->id }}" @if($task->project_id == $project->id) selected @endif>{{ $project->name }}</option>
            @endforeach
        </select>
        <button type="submit">Update Task</button>
    </form>
@endsection
