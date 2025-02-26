import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Typography, Button } from "@mui/material";

const SortableItem = ({ id, task, removeTask }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    p: 2,
    mb: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    cursor: "grab",
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Typography>{task.text}</Typography>
      <Button onClick={removeTask} sx={{ color: "red" }}>
        Удалить
      </Button>
    </Box>
  );
};

export default SortableItem;
