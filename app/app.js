var app = angular.module('todoApp', ['ngRoute', 'ngAnimate', 'toaster']);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "view/todoList.htm",
            controller: "TodoList"
        })
});

app.controller('TodoList', ['$scope', 'toaster', function ($scope, toaster) {

    $scope.saved = localStorage.getItem('todos')
    $scope.todos = (localStorage.getItem('todos') !== null) ?
        JSON.parse($scope.saved) : [
            {
                created_at: new Date().toLocaleString(),
                text: "Let's Complete AngulatJS App",
                is_complete: false
            }
        ]
    localStorage.setItem('todos', JSON.stringify($scope.todos))
    console.log($scope.todos)

    $scope.addNewTodo = function () {
        const todo = {
            created_at: new Date().toLocaleString(),
            text: $scope.todoText === undefined ? "" : $scope.todoText,
            is_complete: false
        }
        if ($scope.todoText === "" || $scope.todoText === undefined) return
        let index = 0
        angular.forEach($scope.todos, function (currTodo) {
            if (currTodo.text === $scope.todoText) {
                index = -1
            } else {
                index = 1
            }
        })
        if (index === 1) {
            $scope.todos.push(todo)
            toaster.pop({ title: "Success", body: "Todo Added" });
        } else if (index === -1) {
            toaster.error({ title: "Be Careful", body: "Todo already created" });
        }
        $scope.todoText = ""
        localStorage.setItem('todos', JSON.stringify($scope.todos))
    }

    $scope.deleteTodo = function (todo) {
        const index = $scope.todos.indexOf(todo)
        $scope.todos.splice(index, 1)
        localStorage.setItem('todos', JSON.stringify($scope.todos))
        toaster.error({ title: "Success", body: "Todo Deleted" });
    }

    $scope.remainings = function () {
        var count = 0
        angular.forEach($scope.todos, function (todo) {
            count += todo.is_complete === true ? 0 : 1
        })
        return count
    }

    $scope.clearCompleted = function () {
        const oldTodos = $scope.todos
        $scope.todos = []
        angular.forEach(oldTodos, function (todo) {
            if (todo.is_complete == false) {
                $scope.todos.push(todo)
            }
        })
        localStorage.setItem('todos', JSON.stringify($scope.todos))
        toaster.success({ title: "Success", body: "Completed Todos Cleared" });
    };

    $scope.completeTodo = function (todo) {
        const oldTodos = $scope.todos;
        $scope.todos = []
        angular.forEach(oldTodos, function (currTodo) {
            if (currTodo.created_at === todo.created_at) {
                $scope.todos.push({
                    created_at: currTodo.created_at,
                    text: currTodo.text,
                    is_complete: !currTodo.is_complete
                })
            } else {
                $scope.todos.push(currTodo)
            }
        })
        localStorage.setItem('todos', JSON.stringify($scope.todos))
    }

}]);