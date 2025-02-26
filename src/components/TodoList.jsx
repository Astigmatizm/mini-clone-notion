import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ task, removeTask }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    marginBottom: "8px",
    backgroundColor: "rgb(63, 72, 99)",
    borderRadius: "8px",
    cursor: "grab",
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Typography>{task.text}</Typography>
      <Button onClick={() => removeTask(task.id)} sx={{ color: "red" }}>
        Удалить
      </Button>
    </Box>
  );
};

const TodoList = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Работа", tasks: [] },
    { id: 2, name: "Учёба", tasks: [] },
  ]);
  const [taskInput, setTaskInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(1);

  useEffect(() => {
    const savedData = localStorage.getItem("todoData");
    if (savedData) setCategories(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    localStorage.setItem("todoData", JSON.stringify(categories));
  }, [categories]);

  const addTask = () => {
    if (taskInput.trim() === "") return;

    setCategories((prev) =>
      prev.map((category) =>
        category.id === selectedCategory
          ? { ...category, tasks: [...category.tasks, { id: Date.now(), text: taskInput }] }
          : category
      )
    );
    setTaskInput("");
  };

  const removeTask = (taskId) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === selectedCategory
          ? { ...category, tasks: category.tasks.filter((task) => task.id !== taskId) }
          : category
      )
    );
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setCategories((prev) =>
      prev.map((category) =>
        category.id === selectedCategory
          ? { ...category, tasks: arrayMove(category.tasks, category.tasks.findIndex(t => t.id === active.id), category.tasks.findIndex(t => t.id === over.id)) }
          : category
      )
    );
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <Typography variant="h3" sx={{ textAlign: "center", color: "rgb(53, 86, 184)", mb: 3 }}>
        To-Do DnD List
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Выбери категорию:</Typography>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "contained" : "outlined"}
            sx={{ m: 1, backgroundColor: selectedCategory === cat.id ? "rgb(53, 86, 184)" : "" }}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </Box>

      <TextField
        label="Добавить задачу"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
      />
      <Button variant="contained" sx={{ backgroundColor: "rgb(53, 86, 184)" }} onClick={addTask}>
        Добавить
      </Button>

      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        {categories.map((cat) =>
          cat.id === selectedCategory ? (
            <SortableContext key={cat.id} items={cat.tasks.map((task) => task.id)}>
              <Box sx={{ mt: 4, color: "#ffffff" }}>
                <Typography variant="h5" sx={{ mb: 2, color: "white" }}>{cat.name}</Typography>
                {cat.tasks.length === 0 ? (
                  <Typography>Задач нет</Typography>
                ) : (
                  cat.tasks.map((task) => (
                    <SortableItem key={task.id} task={task} removeTask={removeTask} />
                  ))
                )}
              </Box>
            </SortableContext>
          ) : null
        )}
      </DndContext>
    </Box>
  );
};

export default TodoList;
