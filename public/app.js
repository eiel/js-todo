var todo = (function() {
  "use strict";
  var keyCode = { ENTER: 13 };

  var Todo = function(view) {
    this.tasks = [];
    this.counter = 0;
    this.view = view;
  };
  Todo.prototype = {
    createTask: function (title) {
      this.tasks.push({id: this.counter, title: title, isDone: false});
      this.counter++;
      this.view.render();
    },
    done: function(task) {
      this.tasks.forEach(function (t) {
        if (t.id === task.id) {
          task.isDone = true;
        }
      });
      this.view.render();
    }
  };

  var TaskView = function(task, todo) {
    this.task = task;
    this.todo = todo;
  };
  TaskView.prototype = {
    render: function () {
      var docfrag = document.createDocumentFragment();
      var elem = document.createElement("li");
      elem.setAttribute("class","task");
      var text = document.createTextNode(this.task.title);
      if (this.task.isDone) {
        var del = document.createElement("del")
        del.appendChild(text);
        elem.appendChild(del);
      } else {
        var button = document.createElement("button");
        button.appendChild(document.createTextNode("完了"));
        var that = this;
        button.addEventListener("click", function() {
          that.todo.done(that.task);
        }, false, this);
        elem.appendChild(text);
        elem.appendChild(button);
      }
      docfrag.appendChild(elem);
      return docfrag;
    }
  };

  var TodoInputView = function (todo){
    this.todo = todo;
  };
  TodoInputView.prototype = {
    render: function () {
      var todo = this.todo;
      var input = document.createElement("input");
      input.setAttribute("type", "text");
      input.addEventListener("keydown", function(e) {
        if (e.keyCode === keyCode.ENTER) {
          todo.createTask(input.value);
        }
      }, false);
      var button = document.createElement("button");
      button.appendChild(document.createTextNode("登録"));
      button.addEventListener("click", function(e) {
        todo.createTask(input.value);
      }, false);
      var docfrag = document.createDocumentFragment();
      docfrag.appendChild(input);
      docfrag.appendChild(button);
      return docfrag;
    }
  };

  var TodoViewController = function(e) {
    this.counter = 0;
    this.elem = e;
    this.todo = new Todo(this);
  };
  TodoViewController.prototype = {
    clear: function () {
      while(this.elem.firstChild){ this.elem.removeChild(this.elem.firstChild); }
    },
    renderHeader: function () {
      var h1 = document.createElement("h1");
      h1.appendChild(document.createTextNode("TODOリスト"));
      return h1;
    },
    render: function () {
      this.clear();
      var todo = this.todo;
      var docfrag = document.createDocumentFragment();
      docfrag.appendChild(this.renderHeader());
      docfrag.appendChild(new TodoInputView(this.todo).render());

      var ul = document.createElement("ul");
      docfrag.appendChild(ul);
      todo.tasks.forEach(function (task) {
        ul.appendChild(new TaskView(task, todo).render());
      });
      this.elem.appendChild(docfrag);
    }
  };
  return {
    TodoViewController: TodoViewController
  };
})();

addEventListener("load", function() {
  var collection = document.getElementsByClassName("todo-list");
  for (var i = 0; i < collection.length; i++) {
    (new todo.TodoViewController(collection[i])).render();
  }
}, false);
