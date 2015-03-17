(function() {
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
      var $docfrag = $(document.createDocumentFragment());
      var $elem = $('<li class="task" />')
      if (this.task.isDone) {
        var del = document.createElement("del")
          .append(this.task.title);
        $elem.append(del);
      } else {
        var button = $('<button>完了</button>');
        var that = this;
        button.click(function() {
          that.todo.done(that.task);
        });
        $elem.text(this.task.title)
          .append(button);
      }
      return $docfrag.append($elem);
    }
  };

  var TodoInputView = function (todo){
    this.todo = todo;
  };
  TodoInputView.prototype = {
    render: function () {
      var todo = this.todo;
      var $input = jQuery('<input type="text">');
      $input.keydown(function(e) {
        if (e.keyCode === keyCode.ENTER) {
          todo.createTask($input.val());
        }
      });
      var $button = jQuery("<button>登録</button>");
      $button.click(function(e) {
        todo.createTask(input.val());
      });
      return jQuery(document.createDocumentFragment())
        .append($input)
        .append($button);
    }
  };

  var TodoViewController = function(e) {
    this.counter = 0;
    this.$elem = jQuery(e);
    this.todo = new Todo(this);
  };
  TodoViewController.prototype = {
    clear: function () {
      this.$elem.empty();
    },
    renderHeader: function () {
      return $("<h1>TODOリスト</h1>");
    },
    render: function () {
      this.clear();
      var todo = this.todo;
      var $docfrag = jQuery(document.createDocumentFragment())
        .append(this.renderHeader())
        .append(new TodoInputView(this.todo).render());

      var $ul = $("<ul />");
      todo.tasks.forEach(function (task) {
        $ul.append(new TaskView(task, todo).render());
      });
      $docfrag.append($ul);
      this.$elem.append($docfrag);
    }
  };
  jQuery.fn.todo = function() {
    jQuery.each(this,function() {
      (new TodoViewController(this)).render();
    });
  };
})();

jQuery(function() {
  jQuery(".todo-list").todo();
});
