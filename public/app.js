"use strict";

var todo = (function() {
  var keyCode = { ENTER: 13 };

  var TaskView = function(task,onDone) {
    this.task = task;
    this.onDone = onDone;
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
        var button = document.createElement('button');
        button.appendChild(document.createTextNode('完了'));
        var that = this;
        button.addEventListener('click',function() {
          that.onDone(that.task);
        });
        elem.appendChild(text);
        elem.appendChild(button);
      }
      docfrag.appendChild(elem);
      return docfrag;
    }
  };

  var TodoInputView = function (onClick){
    this.onClick = onClick;
  };
  TodoInputView.prototype = {
    render: function () {
      var that = this;
      var input = document.createElement("input");
      input.setAttribute("type","text");
      input.addEventListener("keydown", function(e) {
        if (e.keyCode == keyCode.ENTER) {
          that.onClick(input.value);
        }
      });
      var button = document.createElement("button");
      button.appendChild(document.createTextNode("登録"));
      button.addEventListener("click", function(e) {
        that.onClick(input.value);
      });
      var docfrag = document.createDocumentFragment();
      docfrag.appendChild(input);
      docfrag.appendChild(button);
      return docfrag;
    }
  };

  var TodoView = function(e) {
    this.counter = 0;
    this.elem = e;
    this.tasks = [];
  };
  TodoView.prototype = {
    tasks: [],
    createTask: function (text) {
      this.tasks.push({
        no: this.counter,
        title: text,
        isDone: false
      });
      this.counter++;
      this.render();
    },
    done: function (task) {
      this.tasks.forEach(function (t) {
        if (t.no == task.no) {
          task.isDone = true;
        }
      });
      this.render();
    },
    clear: function () {
      while(this.elem.firstChild){ this.elem.removeChild(this.elem.firstChild); }
    },
    renderHeader: function () {
      var h1 = document.createElement("h1");
      return h1.appendChild(document.createTextNode("TODOリスト"));
    },
    onCreate: function() {
      var that = this;
      return function(n) { return that.createTask(n); };
    },
    onDone: function() {
      var that = this;
      return function(n) { return that.done(n); }
    },
    render: function () {
      this.clear();
      var docfrag = document.createDocumentFragment();
      docfrag.appendChild(this.renderHeader());
      var that = this;
      docfrag.appendChild(new TodoInputView(this.onCreate()).render());

      var ul = document.createElement("ul");
      docfrag.appendChild(ul);
      this.tasks.forEach(function (task) {
        ul.appendChild(new TaskView(task,this.onDone()).render());
      });
      this.elem.appendChild(docfrag);
    }
  };
  return {
    TaskView: TaskView,
    TodoView: TodoView,
    TodoInputView: TodoInputView
  };
})();

addEventListener("load",function() {
  var collection = document.getElementsByClassName("todo-list");
  for (var i=0; i<collection.length; i++) {
    (new todo.TodoView(collection[i])).render();
  };
},false);
